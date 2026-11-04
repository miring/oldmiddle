import type { Partner } from './matchTypes'
import type { MeetingPurpose } from './myInfoTypes'

/*
 * 오늘의 추천 데이터 모양 (기획서 7장 횟수제 매칭·쌍방 체크, 9장 인연이 오는 날).
 * 만나기 전에는 성·나이대·구까지만 보여 줍니다 (8장). 외모·직업·소득 값은 두지 않고, 그것으로 정렬하지도 않습니다 (7장).
 */

export type Recommendation = {
  id: string
  partner: Partner
  /** 사진 장수 (2~3장). 더미라 실제 사진 대신 자리 표시 */
  photoCount: number
  intro: string
  /** 하고 싶은 취미 3개 */
  hobbies: string[]
  /** 가치관 질문 5개의 답 (질문 문구는 matchingCopy.ts의 내 정보와 같음) */
  values: string[]
  purpose: MeetingPurpose
  /** 독신 확인한 달. 없으면 배지를 보이지 않습니다 */
  singleVerifiedMonth: string | null
  /** 음성 자기소개가 있는지 (재생은 준비 중) */
  hasVoiceIntro: boolean
}

/**
 * 이번 회차 추천에 대한 내 답
 * - letter: 만나보고 싶어요 + 한 줄 편지 (상대 답을 기다림)
 * - keep: 마음에 담기 (상대에게 알리지 않음)
 * - pass: 다음에요 (6개월 동안 다시 추천하지 않음)
 */
export type RecommendResponse = { kind: 'letter'; letter: string } | { kind: 'keep' } | { kind: 'pass' }

/** 마음에 담은 사람. 본인만 보고, 60일이 지나면 조용히 사라집니다 */
export type KeptPerson = { recommendation: Recommendation; keptAt: string }

/** 쌍방 매칭: 서로 마음에 담음. 24시간 안에 [만나볼게요]를 누르면 교환일기로 */
export type MutualMatch = { recommendation: Recommendation; matchedAt: string }
