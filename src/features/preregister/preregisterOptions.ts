import regionData from '../../data/regions.json'
import type { ConsentItem } from '../../components/ui/ConsentGroup/ConsentGroup'
import { CONSENT_COPY } from '../../config/copy'

// 사전 신청 폼 선택지와 동의 항목. 문구는 Figma "사전신청 01 신청 폼" 기준입니다.

export const GENDER_OPTIONS = [
  { value: 'female', label: '여성' },
  { value: 'male', label: '남성' },
]

export const UNDER_45 = 'under45'

export const AGE_OPTIONS = [
  { value: '45-49', label: '45~49' },
  { value: '50-54', label: '50~54' },
  { value: '55-59', label: '55~59' },
  { value: '60-64', label: '60~64' },
  { value: '65+', label: '65 이상' },
  { value: UNDER_45, label: '45 미만' },
]

export type Region = { code: string; name: string; districts: { code: string; name: string }[] }

/** 시·도 / 시·군·구 (행정안전부 법정동코드 기준, src/data/regions.json) */
export const REGIONS: Region[] = regionData.regions

// 동의 항목 ID·필수 여부는 여기서, 화면에 보이는 이름은 src/config/copy.ts에서 가져옵니다.
export const CONSENT_ITEMS: ConsentItem[] = [
  { id: 'age-and-notice', label: CONSENT_COPY.labels.notice, required: true },
  { id: 'privacy', label: CONSENT_COPY.labels.privacy, required: true },
  { id: 'marketing', label: CONSENT_COPY.labels.marketing, required: false },
]

/** 휴대폰 번호를 숫자만 남겨 010-1234-5678 모양으로 */
export function formatPhone(input: string): string {
  const digits = input.replace(/\D/g, '').slice(0, 11)
  if (digits.length < 4) return digits
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  const middle = digits.length === 11 ? 4 : 3
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + middle)}-${digits.slice(3 + middle)}`
}

export function isValidMobile(phone: string): boolean {
  return /^01[016789]\d{7,8}$/.test(phone.replace(/\D/g, ''))
}
