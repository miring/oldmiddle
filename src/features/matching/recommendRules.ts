import type { PlanId } from './myInfoTypes'

/*
 * 오늘의 추천 규칙 (기획서 7장, 9장). 화면에 보일 상태는 저장하지 않고 지금 시각으로 그때그때 계산합니다.
 * '인연이 오는 날'은 한국 시간 저녁 8시. 스탠다드는 화·금, 베이직은 화요일만 (월 4명 / 8명).
 */

/** 공개 뒤 응답 기한 */
export const RESPONSE_HOURS = 48
/** 쌍방 매칭 뒤 [만나볼게요] 마지막 확인 기한 */
export const MUTUAL_HOURS = 24
/** 마음에 담을 수 있는 사람 수 */
export const KEEP_MAX = 5
/** 마음에 담은 뒤 상대가 담지 않으면 조용히 사라지는 날 수 */
export const KEEP_DAYS = 60
/** '다음에요'를 고른 사람을 다시 추천하지 않는 달 수 */
export const PASS_MONTHS = 6

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const KST_OFFSET = 9 * HOUR
const REVEAL_HOUR = 20

/** 요금제별 '인연이 오는 날' 요일 (0 일요일 … 2 화요일, 5 금요일) */
const REVEAL_WEEKDAYS: Record<PlanId, number[]> = { basic: [2], standard: [2, 5] }

/** 그날(한국 날짜) 저녁 8시 */
function revealOn(kstDay: Date): number {
  return Date.UTC(kstDay.getUTCFullYear(), kstDay.getUTCMonth(), kstDay.getUTCDate(), REVEAL_HOUR) - KST_OFFSET
}

/** 지금 이전의 가장 가까운 공개 시각 */
export function latestReveal(plan: PlanId, now: Date): number {
  for (let back = 0; back <= 7; back += 1) {
    const day = new Date(now.getTime() + KST_OFFSET - back * DAY)
    const time = revealOn(day)
    if (REVEAL_WEEKDAYS[plan].includes(day.getUTCDay()) && time <= now.getTime()) return time
  }
  throw new Error('공개 요일이 없습니다')
}

/** 지금 이후의 가장 가까운 공개 시각 */
export function nextReveal(plan: PlanId, now: Date): number {
  for (let ahead = 0; ahead <= 7; ahead += 1) {
    const day = new Date(now.getTime() + KST_OFFSET + ahead * DAY)
    const time = revealOn(day)
    if (REVEAL_WEEKDAYS[plan].includes(day.getUTCDay()) && time > now.getTime()) return time
  }
  throw new Error('공개 요일이 없습니다')
}

/** 응답 기한: 공개 + 48시간 */
export const responseDeadline = (revealedAt: number) => revealedAt + RESPONSE_HOURS * HOUR
export const mutualDeadline = (matchedAt: string) => Date.parse(matchedAt) + MUTUAL_HOURS * HOUR
export const keepUntil = (keptAt: string) => Date.parse(keptAt) + KEEP_DAYS * DAY

/** 남은 시간 (시간 단위, 1시간이 안 남으면 분) */
export function timeLeft(until: number, now: Date): { hours: number; minutes: number } {
  const ms = Math.max(0, until - now.getTime())
  return { hours: Math.floor(ms / HOUR), minutes: Math.ceil((ms % HOUR) / (60 * 1000)) }
}

/** 다음 달 1일 (이번 달 추천을 모두 썼을 때 다시 채워지는 날) */
export function nextMonthStart(now: Date): number {
  const kst = new Date(now.getTime() + KST_OFFSET)
  return Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth() + 1, 1) - KST_OFFSET
}

/**
 * 나와 같은 답인지. 지금은 글이 똑같을 때만 같다고 봅니다.
 * TODO(가입·프로필): 취미·가치관 질문을 선택형으로 받으면 선택지 id로 비교합니다
 */
export const isSameAnswer = (mine: string | undefined, theirs: string) => mine !== undefined && mine.trim() === theirs.trim()
