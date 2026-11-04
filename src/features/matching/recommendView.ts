import { useSyncExternalStore } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMatchesVersion, getNow, subscribeMatches } from '../../mocks/matches'
import { getMyInfo, getMyInfoVersion, subscribeMyInfo } from '../../mocks/myInfo'
import { getKept, getMutual, getRecommendVersion, getResponse, getRoundRecommendation, subscribeRecommend } from '../../mocks/recommend'
import { formatDayWeekday } from './matchView'
import { keepUntil, latestReveal, mutualDeadline, nextReveal, responseDeadline, timeLeft } from './recommendRules'

/**
 * 오늘의 추천 화면 상태
 * - open: 이번 회차 추천이 와 있고 48시간 응답 기한 안
 * - responded: 이번 회차에 답함 (만나보고 싶어요·마음에 담기·다음에요)
 * - round-ended: 답하지 않고 기한이 지남. 다음 '인연이 오는 날'을 기다림
 * - month-used: 이번 달 추천을 모두 씀
 */
export type TodayState = 'open' | 'responded' | 'round-ended' | 'month-used'

/** 화면이 쓰는 오늘의 추천 데이터. 더미 데이터(시각·내 정보·추천)가 바뀌면 다시 그립니다 */
export function useRecommendData() {
  useSyncExternalStore(subscribeMatches, getMatchesVersion)
  useSyncExternalStore(subscribeMyInfo, getMyInfoVersion)
  useSyncExternalStore(subscribeRecommend, getRecommendVersion)

  const now = getNow()
  const info = getMyInfo()
  const revealedAt = latestReveal(info.plan.id, now)
  const deadline = responseDeadline(revealedAt)
  const response = getResponse(revealedAt)
  const mutual = getMutual()
  const state: TodayState = response
    ? 'responded'
    : info.plan.recommendLeft === 0
      ? 'month-used'
      : now.getTime() < deadline
        ? 'open'
        : 'round-ended'

  return {
    now,
    info,
    state,
    revealedAt,
    deadline,
    next: nextReveal(info.plan.id, now),
    recommendation: getRoundRecommendation(revealedAt),
    response,
    // 60일이 지난 담기는 조용히 사라집니다
    kept: getKept().filter((person) => keepUntil(person.keptAt) > now.getTime()),
    // 24시간이 지나면 쌍방 매칭 안내도 사라집니다
    mutual: mutual && mutualDeadline(mutual.matchedAt) > now.getTime() ? mutual : null,
  }
}

const c = MATCHING_COPY.today

/** '11월 5일(목) 저녁 8시' (공개·기한은 늘 저녁 8시) */
export const formatReveal = (time: number) => c.revealTime(formatDayWeekday(time))

/** '35시간 남았어요' / '40분 남았어요' */
export function formatTimeLeft(until: number, now: Date) {
  const { hours, minutes } = timeLeft(until, now)
  return hours > 0 ? c.hoursLeft(hours) : c.minutesLeft(minutes)
}
