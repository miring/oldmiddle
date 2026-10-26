// 사전 신청 저장 (Edge Function)
// 폼 → 인증번호 확인 → 휴대폰 번호 암호화·해시 → preregistrations 저장 → 같은 지역 신청 수 반환
//
// 필요한 비밀 값 (supabase secrets set):
//   PHONE_ENC_KEY   번호 암호화 키 (32바이트 base64). 잃어버리면 저장된 번호를 되돌릴 수 없음
//   PHONE_HASH_KEY  번호 해시(HMAC) 키 (임의의 긴 문자열)
//   ALLOWED_ORIGINS 신청을 받을 사이트 주소, 쉼표로 구분 (예: http://localhost:5173,https://xxx.vercel.app)
//   DEV_FIXED_CODE  개발용 고정 인증번호 (dev 프로젝트에만). 없으면 문자 인증 준비 전이라 저장하지 않음
// SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY는 Supabase가 자동으로 넣어 줍니다.
import { createClient } from 'npm:@supabase/supabase-js@2'

const GENDER: Record<string, string> = { female: 'F', male: 'M' }
const AGE_BANDS = ['45-49', '50-54', '55-59', '60-64', '65+']
const REQUIRED_CONSENTS = ['age-and-notice', 'privacy']

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, {
  auth: { persistSession: false },
})

function corsHeaders(origin: string | null): Record<string, string> {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    Vary: 'Origin',
  }
  if (origin && allowedOrigins.includes(origin)) headers['Access-Control-Allow-Origin'] = origin
  return headers
}

function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(text: string) {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
}

// 발송할 때 되돌릴 수 있게 AES-GCM으로 암호화. 형식: v1.<iv>.<암호문>
async function encryptPhone(phone: string) {
  const key = await crypto.subtle.importKey('raw', fromBase64(Deno.env.get('PHONE_ENC_KEY')!), 'AES-GCM', false, [
    'encrypt',
  ])
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(phone))
  return `v1.${toBase64(iv)}.${toBase64(new Uint8Array(cipher))}`
}

// 중복 확인·번호로 찾기용. 키 없는 해시는 번호 경우의 수가 적어 역산되므로 HMAC 사용
async function hashPhone(phone: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('PHONE_HASH_KEY')!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(phone))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin')
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin)
  if (!origin || !allowedOrigins.includes(origin)) return json({ error: 'origin_not_allowed' }, 403, origin)

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return json({ error: 'invalid_body' }, 400, origin)
  }

  const gender = GENDER[String(body.gender)]
  const ageBand = String(body.age_band)
  const regionCode = String(body.sigungu_code ?? '')
  const phone = String(body.phone ?? '')
  const consents = (body.consents ?? {}) as Record<string, unknown>
  const consentVersion = String(body.consent_version ?? '')
  const testType = typeof body.test_type === 'string' ? body.test_type.slice(0, 40) : null

  if (
    !gender ||
    !AGE_BANDS.includes(ageBand) ||
    !/^\d{2}(\d{3})?$/.test(regionCode) ||
    !/^01[016789]\d{7,8}$/.test(phone) ||
    !REQUIRED_CONSENTS.every((id) => consents[id] === true) ||
    !consentVersion ||
    consentVersion.length > 40
  ) {
    return json({ error: 'invalid_input' }, 400, origin)
  }

  // TODO(문자 인증): 발송 대행사를 붙이면 서버에 저장한 인증번호(3분 유효)와 비교하도록 바꿉니다.
  const devCode = Deno.env.get('DEV_FIXED_CODE')
  if (!devCode) return json({ error: 'sms_not_ready' }, 503, origin)
  if (String(body.code ?? '') !== devCode) return json({ error: 'invalid_code' }, 400, origin)

  const { error } = await supabase.from('preregistrations').insert({
    gender,
    age_group: ageBand,
    region_code: regionCode,
    phone_enc: await encryptPhone(phone),
    phone_hash: await hashPhone(phone),
    test_type: testType,
    consent_version: consentVersion,
    marketing_agreed_at: body.marketing_opt_in === true ? new Date().toISOString() : null,
  })
  if (error) {
    if (error.code === '23505') return json({ error: 'already_registered' }, 409, origin)
    console.error('insert failed', error.code) // 개인정보가 섞이지 않게 코드만 남김
    return json({ error: 'save_failed' }, 500, origin)
  }

  const { data: count } = await supabase.rpc('count_region_preregistrations', { p_region_code: regionCode })
  return json({ sameRegionCount: typeof count === 'number' ? count : null }, 200, origin)
})
