import { CONSENT_VERSION } from '../../config/copy'
import type { PreregisterDraft } from './preregisterDraft'

/** 저장할 사전 신청 값. 지역은 법정동코드, 화면 이름은 저장하지 않음 */
export type PreregisterPayload = {
  gender: string
  age_band: string
  sido_code: string
  sigungu_code: string
  /** 앞뒤 공백을 뺀 메일 주소 (서버에서 소문자로 맞춤) */
  email: string
  test_type: string | null
  marketing_opt_in: boolean
  consents: Record<string, boolean>
  consent_version: string
}

export function buildPreregisterPayload(draft: PreregisterDraft, testType: string | null): PreregisterPayload {
  return {
    gender: draft.gender ?? '',
    age_band: draft.age ?? '',
    sido_code: draft.province,
    sigungu_code: draft.district,
    email: draft.email.trim(),
    test_type: testType,
    marketing_opt_in: Boolean(draft.consents.marketing),
    consents: draft.consents,
    consent_version: CONSENT_VERSION,
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** 서버가 돌려준 실패 이유 (예: 'already_registered', 'expired') */
export class PreregisterError extends Error {
  code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}

async function callFunction(name: string, body: unknown): Promise<Record<string, unknown>> {
  const res = await fetch(`${SUPABASE_URL}/functions/v1/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY! },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new PreregisterError(typeof data.error === 'string' ? data.error : 'unknown')
  return data
}

/** 저장 로직 연결 전(주소·키 없음)에 확인 화면을 시험해 볼 수 있는 토큰 */
const MOCK_CONFIRM_TOKEN = '00000000-0000-4000-8000-000000000000'

/**
 * 사전 신청 접수: 서버가 '확인 전'으로 저장하고 확인 메일을 보냅니다. 신청은 메일 속 링크를 눌러야 끝납니다.
 * Supabase 주소·키(.env.local)가 없으면 콘솔에만 출력합니다. 로그에는 메일 주소를 가려서 찍습니다.
 * 개발 DB(DEV_EMAIL_LINK)에서는 메일 대신 확인 링크가 돌아와 콘솔에 찍습니다.
 */
export async function submitPreregistration(payload: PreregisterPayload): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.info('[사전 신청] 저장할 값', { ...payload, email: payload.email.replace(/^(.).*@/, '$1***@') })
    console.info('[사전 신청] 확인 링크 (시험용)', `#/confirm/${MOCK_CONFIRM_TOKEN}`)
    return
  }
  const data = await callFunction('preregister', payload)
  if (typeof data.devConfirmUrl === 'string') console.info('[사전 신청] 확인 링크 (개발용)', data.devConfirmUrl)
}

export type ConfirmResult = { regionCode: string; testType: string | null; sameRegionCount: number | null }

/**
 * 확인 메일 속 링크(#/confirm/<토큰>)로 신청을 끝냅니다. 같은 링크를 다시 열어도 같은 결과를 돌려줍니다.
 * 찾을 수 없으면 'not_found', 2일이 지났으면 'expired'를 던집니다.
 */
export async function confirmPreregistration(token: string): Promise<ConfirmResult> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.info('[사전 신청 확인] 저장 로직 연결 전이라 시험용 결과를 보여 줘요')
    if (token !== MOCK_CONFIRM_TOKEN) throw new PreregisterError('not_found')
    return { regionCode: '11', testType: null, sameRegionCount: null }
  }
  const data = await callFunction('preregister-confirm', { token })
  return {
    regionCode: String(data.regionCode ?? ''),
    testType: typeof data.testType === 'string' ? data.testType : null,
    sameRegionCount: typeof data.sameRegionCount === 'number' ? data.sameRegionCount : null,
  }
}

/**
 * 사전 신청 취소: 취소 링크의 토큰으로 신청을 찾아 바로 삭제합니다.
 * 찾을 수 없으면(이미 취소함·잘못된 링크) PreregisterError('not_found')를 던집니다.
 */
export async function cancelPreregistration(token: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.info('[사전 신청 취소] 저장 로직 연결 전이라 실제로 지우지 않아요')
    return
  }
  await callFunction('preregister-cancel', { token })
}
