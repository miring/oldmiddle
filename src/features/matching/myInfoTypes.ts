import type { MEETING_PURPOSE_OPTIONS } from '../../config/copy'
import type { CompanionType } from '../../data/companionTypes'

/*
 * '내 정보' 데이터 모양 (기획서 7장 프로필 구성, 8장 독신 확인, 9장 알림, 10장 요금).
 * 만날 수 있는 때는 기획서 저장 모양 그대로: available_days(['sat','sun']) · available_bands(['late_morning','afternoon'])
 */

export const DAY_KEYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
export type DayKey = (typeof DAY_KEYS)[number]

/** late_morning: 오전 늦게 11~13시 / afternoon: 오후 13~18시 (가입 질문 13번) */
export const BAND_KEYS = ['late_morning', 'afternoon'] as const
export type BandKey = (typeof BAND_KEYS)[number]

export type Availability = {
  available_days: DayKey[]
  available_bands: BandKey[]
}

export type PhotoStatus = 'reviewing' | 'public'
export type MeetingPurpose = (typeof MEETING_PURPOSE_OPTIONS)[number]['id']
export type PlanId = 'basic' | 'standard'

export type MyInfo = {
  /** 2~3장. 바꾸면 다시 확인 중이 됩니다 */
  photos: { id: string; status: PhotoStatus }[]
  intro: string
  /** 하고 싶은 취미 3개 */
  hobbies: string[]
  /** 가치관 질문 5개의 답 (질문 문구는 matchingCopy.ts) */
  values: string[]
  purpose: MeetingPurpose
  /** 사랑하는 방식 결과. 본인만 봅니다 */
  loveType: CompanionType
  /** 독신 확인한 달 ('2026-11'). 제출하지 않았으면 null */
  singleVerifiedMonth: string | null
  availability: Availability
  /** 나에게 추천될 수 있는 조건 (받는 쪽 조건) */
  preferences: { ageMin: number; ageMax: number; smoking: 'non-smoker' | 'any'; verifiedOnly: boolean }
  plan: { id: PlanId; recommendLeft: number; meetingLeft: number; nextBillingDate: string }
  /** true: '인연이 오는 날' 알림만 받기 */
  notifyDayOnly: boolean
}
