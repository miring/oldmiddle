// 사전 신청 접수 (Edge Function)
// 폼 → 이메일 암호화·해시 → preregistrations에 '확인 전'으로 저장 → 확인 링크 메일 발송
// 메일의 링크를 누르면 preregister-confirm이 확인을 마칩니다. 2일 안에 확인하지 않으면 자동으로 지웁니다.
// 비밀 값은 ../_shared/preregister.ts 맨 위 설명을 봅니다.
import { devEmailLink, encrypt, guard, hmac, json, mailHtml, mailReady, sendMail, supabase } from '../_shared/preregister.ts'

const GENDERS = ['female', 'male']
const AGE_BANDS = ['45-49', '50-54', '55-59', '60-64', '65+']
const REQUIRED_CONSENTS = ['age-and-notice', 'privacy']
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// 횟수 제한: [창(초), 최대 횟수]. 넘으면 429. 운영하며 조정합니다.
const EMAIL_LIMIT: [number, number] = [10 * 60, 3] // 같은 메일 10분에 3번 (확인 메일 다시 받기 포함)
const IP_LIMIT: [number, number] = [60 * 60, 30] // 같은 IP 1시간에 30번 (가족·회사가 IP를 같이 쓸 수 있어 넉넉하게)

// 기록하고 넘었는지 확인. DB 오류면 신청을 막지 않음 (제한 기능 장애로 신청 전체가 멈추지 않게)
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

  const gender = String(body.gender)
  const ageBand = String(body.age_band)
  const regionCode = String(body.sigungu_code ?? '')
  const email = String(body.email ?? '').trim().toLowerCase()
  const consents = (body.consents ?? {}) as Record<string, unknown>
  const consentVersion = String(body.consent_version ?? '')
  const testType = typeof body.test_type === 'string' ? body.test_type.slice(0, 40) : null

  if (
    !GENDERS.includes(gender) ||
    !AGE_BANDS.includes(ageBand) ||
    !/^\d{2}(\d{3})?$/.test(regionCode) ||
    email.length > 254 ||
    !EMAIL.test(email) ||
    !REQUIRED_CONSENTS.every((id) => consents[id] === true) ||
    !consentVersion ||
    consentVersion.length > 40
  ) {
    return json({ error: 'invalid_input' }, 400, origin)
  }

  const emailHash = await hmac(email)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown'
  if ((await limited(`ip:${await hmac(ip)}`, IP_LIMIT)) || (await limited(`email:${emailHash}`, EMAIL_LIMIT))) {
    return json({ error: 'too_many_requests' }, 429, origin)
  }

  // 메일을 보낼 수 없으면 저장하지 않음 (확인할 길이 없는 신청이 쌓이지 않게)
  if (!mailReady() && !devEmailLink()) return json({ error: 'email_not_ready' }, 503, origin)

  const values = {
    gender,
    age_group: ageBand,
    region_code: regionCode,
    test_type: testType,
    consent_version: consentVersion,
    marketing_agreed_at: body.marketing_opt_in === true ? new Date().toISOString() : null,
  }

  // 같은 메일로 이미 신청했으면: 확인을 마쳤으면 '이미 신청', 확인 전이면 새 내용으로 바꾸고 확인 메일을 다시 보냄
  const { data: existing } = await supabase
    .from('preregistrations')
    .select('id, confirmed_at')
    .eq('email_hash', emailHash)
    .is('canceled_at', null)
    .maybeSingle()
  if (existing?.confirmed_at) return json({ error: 'already_registered' }, 409, origin)

  const confirmToken = crypto.randomUUID()
  const { error } = existing
    ? await supabase
        .from('preregistrations')
        .update({ ...values, confirm_token: confirmToken, confirm_sent_at: new Date().toISOString() })
        .eq('id', existing.id)
    : await supabase.from('preregistrations').insert({
        ...values,
        email_enc: await encrypt(email),
        email_hash: emailHash,
        confirm_token: confirmToken,
      })
  if (error) {
    if (error.code === '23505') return json({ error: 'already_registered' }, 409, origin)
    // 메일은 암호화·해시 상태라 원문이 섞이지 않음. 원인 파악용으로 코드와 메시지만 남김
    console.error('save failed', error.code, error.message)
    return json({ error: 'save_failed', reason: error.code }, 500, origin)
  }

  // # 뒤는 서버로 전송되지 않아 토큰이 접속 기록에 남지 않음
  const confirmUrl = `${origin}/#/confirm/${confirmToken}`
  if (!mailReady()) return json({ pending: true, devConfirmUrl: confirmUrl }, 200, origin)

  const sent = await sendMail(
    email,
    '[시연] 사전 신청을 확인해 주세요',
    `시연(時緣) 사전 신청을 마치려면 아래 주소를 열어 주세요.\n${confirmUrl}\n\n2일 안에 확인하지 않으면 신청 정보는 자동으로 지워져요.\n신청하지 않으셨다면 이 메일은 지우셔도 돼요.`,
    mailHtml(
      ['시연(時緣) 사전 신청을 해 주셔서 고마워요.', '아래 버튼을 누르면 신청이 끝나요.'],
      { label: '신청 확인하기', url: confirmUrl },
      ['2일 안에 확인하지 않으면 신청 정보는 자동으로 지워져요.', '신청하지 않으셨다면 이 메일은 지우셔도 돼요.'],
    ),
  )
  if (!sent) return json({ error: 'email_failed' }, 502, origin)
  return json({ pending: true }, 200, origin)
})
