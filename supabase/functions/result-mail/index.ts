// 테스트 결과를 '내 메일'로 보내기 (Edge Function) — 결과 화면 [내 메일로 결과 받기]
// 메일 주소는 저장하지 않습니다. 횟수 제한용으로만 해시(HMAC)를 하루 남깁니다 (preregister_attempts).
// 내용은 서버에 고정된 문구만 씀 (화면에서 보낸 글을 메일에 넣지 않아 스팸 창구가 되지 않게)
import { devEmailLink, guard, hmac, json, mailHtml, mailReady, sendMail, supabase } from '../_shared/preregister.ts'

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 결과 문구: src/features/quiz/results.ts·src/data/companionTypes.ts와 같게 유지
const RESULTS: Record<string, { name: string; value: string; tagline: string; match: string; tip: string }> = {
  A: {
    name: '따뜻한 안식처형',
    value: '정서적 안정·배려',
    tagline: '말보다 꼼꼼한 챙김으로 사랑을 느끼는 사람',
    match: '든든한 생활동반자형',
    tip: '챙겨주기보다 나에 대해 하나씩 이야기해 보세요. 받는 것도 관계의 일부예요.',
  },
  B: {
    name: '함께 걷는 친구형',
    value: '활동·경험 공유',
    tagline: '같이 걷고, 먹고, 여행하며 가까워지는 사람',
    match: '깊은 대화형',
    tip: '앉아서만 대화하기보다 짧은 산책을 제안해 보세요. 자연스러운 당신이 나옵니다.',
  },
  C: {
    name: '깊은 대화형',
    value: '공감·정신적 교감',
    tagline: '서로의 생각과 인생 이야기를 나누며 가까워지는 사람',
    match: '함께 걷는 친구형',
    tip: '상대를 바로 판단하기보다 두세 번은 만나 보세요. 깊은 사람은 천천히 보여요.',
  },
  D: {
    name: '든든한 생활동반자형',
    value: '신뢰·현실적 협력',
    tagline: '약속을 지키고 일상을 함께 꾸려가는 것에서 안정을 느끼는 사람',
    match: '따뜻한 안식처형',
    tip: '조건을 확인하는 질문보다 “요즘 뭐가 즐거우세요?”로 시작해 보세요.',
  },
}

// 횟수 제한: [창(초), 최대 횟수]
const EMAIL_LIMIT: [number, number] = [24 * 60 * 60, 3] // 같은 메일 하루 3번
const IP_LIMIT: [number, number] = [60 * 60, 10] // 같은 IP 1시간 10번

async function limited(key: string, [windowSeconds, max]: [number, number]) {
  const { data, error } = await supabase.rpc('hit_preregister_rate_limit', {
    p_key: key,
    p_window_seconds: windowSeconds,
    p_max: max,
  })
  if (error) console.error('rate limit check failed', error.code)
  return data === true
}

Deno.serve(async (req) => {
  const blocked = guard(req)
  if (blocked) return blocked
  const origin = req.headers.get('Origin')!

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid_body' }, 400, origin)
  }

  const email = String(body.email ?? '').trim().toLowerCase()
  const result = RESULTS[String(body.type ?? '')]
  if (!result || email.length > 254 || !EMAIL.test(email)) return json({ error: 'invalid_input' }, 400, origin)

  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if (
    (await limited(`result-ip:${await hmac(ip)}`, IP_LIMIT)) ||
    (await limited(`result-email:${await hmac(email)}`, EMAIL_LIMIT))
  ) {
    return json({ error: 'too_many_requests' }, 429, origin)
  }

  if (!mailReady()) {
    // 개발 DB: 메일 없이 성공으로 돌려줌 (화면 흐름 시험용)
    if (devEmailLink()) return json({ sent: false, dev: true }, 200, origin)
    return json({ error: 'email_not_ready' }, 503, origin)
  }

  const testUrl = `${origin}/#/test`
  const sent = await sendMail(
    email,
    `[시연] 나의 동행 유형은 '${result.name}'이에요`,
    `나의 동행 유형: ${result.name} (${result.value})\n${result.tagline}\n\n잘 맞는 인연: ${result.match}\n첫 만남 팁: ${result.tip}\n\n테스트 다시 하기·지인에게 권하기: ${testUrl}\n\n결과 받기를 요청하셔서 보낸 메일이에요. 메일 주소는 저장하지 않아요.`,
    mailHtml(
      [
        `나의 동행 유형은 <strong>${result.name}</strong>이에요.`,
        `${result.value} · ${result.tagline}`,
        `잘 맞는 인연: <strong>${result.match}</strong>`,
        `첫 만남 팁: ${result.tip}`,
        '이 메일을 지인에게 전달해 테스트를 권해 보세요.',
      ],
      { label: '테스트 해 보기', url: testUrl },
      ['결과 받기를 요청하셔서 보낸 메일이에요. 메일 주소는 저장하지 않아요.', '요청하지 않으셨다면 이 메일은 지우셔도 돼요.'],
      { origin },
    ),
  )
  if (!sent) return json({ error: 'email_failed' }, 502, origin)
  return json({ sent: true }, 200, origin)
})
