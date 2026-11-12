// 사전 신청 확인 (Edge Function)
// 확인 메일 속 링크(#/confirm/<토큰>)로 들어오면 신청을 '확인됨'으로 바꾸고, 취소 링크가 든 접수 완료 메일을 보냅니다.
// 같은 링크를 다시 눌러도(두 번 클릭, 다른 기기) 완료 화면을 그대로 보여 주고 메일은 다시 보내지 않습니다.
import { decrypt, guard, json, mailHtml, mailReady, sendMail, supabase } from '../_shared/preregister.ts'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const CONFIRM_HOURS = 48 // 확인 메일을 보낸 뒤 이 시간이 지나면 링크가 끝남 (자동 파기와 같은 2일)

Deno.serve(async (req) => {
  const blocked = guard(req)
  if (blocked) return blocked
  const origin = req.headers.get('Origin')!

  let token = ''
  try {
    token = String((await req.json()).token ?? '')
  } catch {
    return json({ error: 'invalid_body' }, 400, origin)
  }
  // 형식이 틀린 토큰은 찾을 수 없음과 같게 응답 (어느 쪽인지 알려 주지 않음)
  if (!UUID.test(token)) return json({ error: 'not_found' }, 404, origin)

  const { data: row, error } = await supabase
    .from('preregistrations')
    .select('id, region_code, test_type, email_enc, cancel_token, confirm_sent_at, confirmed_at')
    .eq('confirm_token', token)
    .is('canceled_at', null)
    .maybeSingle()
  if (error) {
    console.error('confirm lookup failed', error.code, error.message)
    return json({ error: 'confirm_failed', reason: error.code }, 500, origin)
  }
  if (!row) return json({ error: 'not_found' }, 404, origin)

  if (!row.confirmed_at) {
    if (Date.now() - new Date(row.confirm_sent_at).getTime() > CONFIRM_HOURS * 3600 * 1000) {
      return json({ error: 'expired' }, 410, origin)
    }
    // confirmed_at이 비어 있을 때만 바꿈 → 동시에 두 번 눌러도 접수 완료 메일은 한 번만
    const { data: updated, error: updateError } = await supabase
      .from('preregistrations')
      .update({ confirmed_at: new Date().toISOString() })
      .eq('id', row.id)
      .is('confirmed_at', null)
      .select('id')
    if (updateError) {
      console.error('confirm failed', updateError.code, updateError.message)
      return json({ error: 'confirm_failed', reason: updateError.code }, 500, origin)
    }
    if (updated && updated.length > 0 && mailReady()) {
      const cancelUrl = `${origin}/#/cancel/${row.cancel_token}`
      // 접수 완료 메일이 실패해도 확인은 끝난 것으로 둠 (취소는 문의 메일로도 받음)
      await sendMail(
        await decrypt(row.email_enc),
        '[시연] 사전 신청이 접수되었어요',
        `시연(時緣) 사전 신청이 접수되었어요.\n서비스를 시작하면 이 메일 주소로 가장 먼저 알려 드릴게요.\n전화로 연락드리거나 가입을 권하지 않아요.\n\n신청을 취소하려면: ${cancelUrl}`,
        mailHtml(
          ['시연(時緣) 사전 신청이 접수되었어요.', '서비스를 시작하면 이 메일 주소로 가장 먼저 알려 드릴게요.', '전화로 연락드리거나 가입을 권하지 않아요.'],
          null,
          [
            `신청을 취소하려면 <a href="${cancelUrl}" style="color:#666">여기</a>를 눌러 주세요. 취소하면 남겨 주신 정보를 바로 지워요.`,
            '문의: help@shiyeon.co.kr',
          ],
        ),
      )
    }
  }

  const { data: count } = await supabase.rpc('count_region_preregistrations', { p_region_code: row.region_code })
  return json(
    { regionCode: row.region_code, testType: row.test_type, sameRegionCount: typeof count === 'number' ? count : null },
    200,
    origin,
  )
})
