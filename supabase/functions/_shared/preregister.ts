// 사전 신청 함수들(preregister, preregister-confirm)이 함께 쓰는 것: 허용 주소, DB 연결, 암호화, 메일 발송
//
// 필요한 비밀 값 (supabase secrets set):
//   PHONE_ENC_KEY   연락처 암호화 키 (32바이트 base64). 이름은 예전 그대로지만 이제 이메일을 암호화합니다
//   PHONE_HASH_KEY  연락처 해시(HMAC) 키. 이름은 예전 그대로
//   ALLOWED_ORIGINS 신청을 받을 사이트 주소, 쉼표로 구분. 메일 속 링크도 이 주소로 만듭니다
//   RESEND_API_KEY  메일 발송(Resend) 키. 없으면 메일을 보내지 않음
//   MAIL_FROM       보내는 사람 (예: 시연(時緣) <noreply@shiyeon.co.kr>). Resend에서 인증한 도메인이어야 함
//   DEV_EMAIL_LINK  개발용(dev 프로젝트에만): 'true'면 메일 대신 확인 링크를 응답으로 돌려줌
import { createClient } from 'npm:@supabase/supabase-js@2'

export const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

// 새 키(sb_secret_…)만 쓰는 프로젝트는 SUPABASE_SECRET_KEYS({"default": "..."})로 들어오므로 둘 다 확인
function serverKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
    if (typeof keys.default === 'string') return keys.default
  } catch {
    // 형식이 다르면 아래 예전 키로
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
}

export const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serverKey(), {
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

export function json(body: unknown, status: number, origin: string | null) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders(origin), 'Content-Type': 'application/json' },
  })
}

/** OPTIONS·POST·허용 주소를 먼저 거름. 통과하면 null */
export function guard(req: Request): Response | null {
  const origin = req.headers.get('Origin')
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin)
  if (!origin || !allowedOrigins.includes(origin)) return json({ error: 'origin_not_allowed' }, 403, origin)
  return null
}

function toBase64(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(text: string) {
  return Uint8Array.from(atob(text), (c) => c.charCodeAt(0))
}

async function encKey(usage: KeyUsage) {
  return crypto.subtle.importKey('raw', fromBase64(Deno.env.get('PHONE_ENC_KEY')!), 'AES-GCM', false, [usage])
}

// 발송할 때 되돌릴 수 있게 AES-GCM으로 암호화. 형식: v1.<iv>.<암호문>
export async function encrypt(text: string) {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const cipher = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, await encKey('encrypt'), new TextEncoder().encode(text))
  return `v1.${toBase64(iv)}.${toBase64(new Uint8Array(cipher))}`
}

export async function decrypt(value: string) {
  const [, iv, cipher] = value.split('.')
  const plain = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromBase64(iv) }, await encKey('decrypt'), fromBase64(cipher))
  return new TextDecoder().decode(plain)
}

// 중복 확인·횟수 제한용. 원문을 남기지 않도록 키를 쓴 해시(HMAC)
export async function hmac(text: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(Deno.env.get('PHONE_HASH_KEY')!),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(text))
  return Array.from(new Uint8Array(sig), (b) => b.toString(16).padStart(2, '0')).join('')
}

/** 메일 발송을 할 수 있는 상태인지 (키·보내는 사람이 둘 다 있어야 함) */
export function mailReady() {
  return Boolean(Deno.env.get('RESEND_API_KEY') && Deno.env.get('MAIL_FROM'))
}

/** 개발용: 메일 대신 링크를 응답으로 돌려줄지 */
export function devEmailLink() {
  return Deno.env.get('DEV_EMAIL_LINK') === 'true'
}

/** Resend로 메일 한 통. 실패하면 false (원인은 상태 코드만 로그에 남김, 주소는 남기지 않음) */
export async function sendMail(to: string, subject: string, text: string, html: string) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${Deno.env.get('RESEND_API_KEY')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: Deno.env.get('MAIL_FROM'), to: [to], reply_to: 'help@shiyeon.co.kr', subject, text, html }),
  })
  if (!res.ok) console.error('mail send failed', res.status)
  return res.ok
}

// 메일은 CSS 변수를 못 쓰므로 토큰 값을 직접 씀 (src/styles/tokens.css)
const MAIL_BUTTON_BG = '#f0c419' // --color-primary (= --color-yellow-500)
const MAIL_BUTTON_TEXT = '#2c2416' // --color-text-on-accent. 노랑 위 흰 글자는 대비가 부족해 쓰지 않음

// 메일 위쪽 이미지. 빌드 때 이름이 바뀌지 않도록 public/mail/에 두고 사이트 주소로 불러옴
// (원본 src/assets/landing/hero-cafe.jpg를 가로 960px로 줄인 것, 메일에서는 가로 480으로 표시)
const MAIL_IMAGE = { path: '/mail/hero-cafe.jpg', width: 480, height: 262 }

/**
 * 간단한 메일 본문 (글자 크게). button이 있으면 큰 버튼 하나, footer는 작은 글씨 (HTML 허용)
 * options.origin: 이미지 주소를 만들 사이트 주소 (메일 속 링크와 같은 origin)
 * options.image: 위쪽 이미지를 넣을지 (기본 넣음). 이미지가 차단돼도 문장·버튼만으로 내용이 통해야 함
 */
export function mailHtml(
  lines: string[],
  button: { label: string; url: string } | null,
  footer: string[],
  options: { origin: string; image?: boolean },
) {
  const p = (t: string) => `<p style="margin:0 0 16px;font-size:18px;line-height:1.6;color:#222">${t}</p>`
  const small = (t: string) => `<p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#666">${t}</p>`
  const imageHtml =
    options.image === false
      ? ''
      : `<img src="${options.origin}${MAIL_IMAGE.path}" width="${MAIL_IMAGE.width}" height="${MAIL_IMAGE.height}" alt="시연(時緣)" style="display:block;width:100%;max-width:480px;height:auto;border:0;margin:0 0 24px">`
  const buttonHtml = button
    ? `<p style="margin:24px 0"><a href="${button.url}" style="display:inline-block;padding:16px 28px;border-radius:12px;background:${MAIL_BUTTON_BG};color:${MAIL_BUTTON_TEXT};font-size:18px;text-decoration:none">${button.label}</a></p>
${small(`버튼이 눌리지 않으면 이 주소를 열어 주세요: ${button.url}`)}`
    : ''
  return `<div style="max-width:480px;margin:0 auto;padding:24px;font-family:sans-serif">
${imageHtml}
${lines.map(p).join('\n')}
${buttonHtml}
${footer.map(small).join('\n')}
</div>`
}
