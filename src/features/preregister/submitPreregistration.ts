import { CONSENT_VERSION } from '../../config/copy'
import type { PreregisterDraft } from './preregisterDraft'

/** 저장할 사전 신청 값. 지역은 법정동코드, 화면 이름은 저장하지 않음 */
export type PreregisterPayload = {
  gender: string
  age_band: string
  sido_code: string
  sigungu_code: string
  /** 숫자만 (예: 01012345678) */
  phone: string
  test_type: string | null
  marketing_opt_in: boolean
  consents: Record<string, boolean>
  consent_version: string
  /** 문자 인증번호 6자리 (서버에서 확인) */
  code: string
}

export function buildPreregisterPayload(draft: PreregisterDraft, testType: string | null): PreregisterPayload {
  return {
    gender: draft.gender ?? '',
    age_band: draft.age ?? '',
    sido_code: draft.province,
    sigungu_code: draft.district,
    phone: draft.phone.replace(/\D/g, ''),
    test_type: testType,
    marketing_opt_in: Boolean(draft.consents.marketing),
    consents: draft.consents,
    consent_version: CONSENT_VERSION,
    code: draft.code,
  }
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined

/** 서버가 돌려준 실패 이유 (예: 'already_registered', 'invalid_code') */
export class PreregisterError extends Error {
  code: string
  constructor(code: string) {
    super(code)
    this.code = code
  }
}

/**
 * 사전 신청 저장. Supabase 주소·키(.env.local)가 있으면 서버 함수로 저장하고, 없으면 콘솔에만 출력합니다.
 * 로그에 개인정보를 남기지 않도록 휴대폰 번호는 가리고 인증번호는 빼고 찍습니다.
 */
export async function submitPreregistration(payload: PreregisterPayload): Promise<{ sameRegionCount: number | null }> {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    const { code: _code, ...rest } = payload
    console.info('[사전 신청] 저장할 값', { ...rest, phone: `${payload.phone.slice(0, 3)}-****-${payload.phone.slice(-4)}` })
    return { sameRegionCount: null }
  }

  const res = await fetch(`${SUPABASE_URL}/functions/v1/preregister`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', apikey: SUPABASE_KEY },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new PreregisterError(typeof data.error === 'string' ? data.error : 'unknown')
  return { sameRegionCount: typeof data.sameRegionCount === 'number' ? data.sameRegionCount : null }
}
