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
  }
}

/**
 * 사전 신청 저장.
 * TODO(사전 신청 저장): 서버 저장을 붙이면 여기서 요청하고, 실패하면 오류를 던집니다.
 * 지금은 콘솔에만 출력합니다. 로그에 개인정보를 남기지 않도록 휴대폰 번호는 가립니다.
 */
export async function submitPreregistration(payload: PreregisterPayload): Promise<void> {
  console.info('[사전 신청] 저장할 값', { ...payload, phone: `${payload.phone.slice(0, 3)}-****-${payload.phone.slice(-4)}` })
}
