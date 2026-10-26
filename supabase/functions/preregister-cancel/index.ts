// 사전 신청 취소 (Edge Function)
// 접수 확인 메시지 속 취소 링크의 토큰으로 신청을 찾아 바로 삭제합니다.
// 필요한 비밀 값: ALLOWED_ORIGINS (preregister와 같은 값을 씀)
import { createClient } from 'npm:@supabase/supabase-js@2'

const allowedOrigins = (Deno.env.get('ALLOWED_ORIGINS') ?? '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean)

function serverKey(): string {
  try {
    const keys = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') ?? '{}')
    if (typeof keys.default === 'string') return keys.default
  } catch {
    // 형식이 다르면 아래 예전 키로
  }
  return Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
}

const supabase = createClient(Deno.env.get('SUPABASE_URL')!, serverKey(), {
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

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

Deno.serve(async (req) => {
  const origin = req.headers.get('Origin')
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders(origin) })
  if (req.method !== 'POST') return json({ error: 'method_not_allowed' }, 405, origin)
  if (!origin || !allowedOrigins.includes(origin)) return json({ error: 'origin_not_allowed' }, 403, origin)

  let token = ''
  try {
    token = String((await req.json()).token ?? '')
  } catch {
    return json({ error: 'invalid_body' }, 400, origin)
  }
  // 형식이 틀린 토큰은 찾을 수 없음과 같게 응답 (어느 쪽인지 알려 주지 않음)
  if (!UUID.test(token)) return json({ error: 'not_found' }, 404, origin)

  const { data, error } = await supabase.from('preregistrations').delete().eq('cancel_token', token).select('id')
  if (error) {
    console.error('cancel failed', error.code, error.message)
    return json({ error: 'cancel_failed', reason: error.code }, 500, origin)
  }
  if (!data || data.length === 0) return json({ error: 'not_found' }, 404, origin)
  return json({ ok: true }, 200, origin)
})
