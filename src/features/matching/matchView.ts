import { useSyncExternalStore } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMatches, getMatchesVersion, getMe, getNow, subscribeMatches } from '../../mocks/matches'
import { currentRound, deliveryTime, entryOf, isRoundOpen, matchPhase, roundState, DIARY_ROUNDS } from './diaryRules'
import type { Match } from './matchTypes'

/** 화면이 쓰는 데이터. 더미 데이터가 바뀌면(편지 저장, 미리보기 설정) 다시 그립니다 */
export function useMatchData() {
  useSyncExternalStore(subscribeMatches, getMatchesVersion)
  return { matches: getMatches(), now: getNow(), me: getMe() }
}

const ORDINALS = ['첫 번째', '두 번째', '세 번째']
export const ordinal = (round: number) => ORDINALS[round - 1] ?? `${round}번째`

/** 상대 이름은 성만: '김○○님'. ○ 뒤에서 줄이 갈리지 않도록 글자 사이를 이어 둡니다(U+2060) */
export const partnerName = (match: Match) => `${match.partner.familyName}\u2060○\u2060○\u2060님`
export const partnerMeta = (match: Match) => `${match.partner.ageBand} · ${match.partner.district}`

const SEOUL = 'Asia/Seoul'
const dayFormat = new Intl.DateTimeFormat('ko-KR', { timeZone: SEOUL, month: 'long', day: 'numeric' })
const weekdayFormat = new Intl.DateTimeFormat('ko-KR', { timeZone: SEOUL, weekday: 'short' })
const hourFormat = new Intl.DateTimeFormat('ko-KR', { timeZone: SEOUL, hour: 'numeric', hour12: true })

/** '11월 2일' */
export const formatDay = (time: number | string) => dayFormat.format(new Date(time))
/** '11월 15일(토) 오후 2시' */
export const formatMeeting = (iso: string) => {
  const date = new Date(iso)
  return `${dayFormat.format(date)}(${weekdayFormat.format(date)}) ${hourFormat.format(date)}`
}

/** 편지 머리: 열린 편지는 열린 날, 아직이면 내 편지가 도착하는 날 */
export function letterHeading(match: Match, round: number, now: Date): string {
  const mine = entryOf(match, round, 'me')
  const theirs = entryOf(match, round, 'partner')
  const day =
    isRoundOpen(match, round, now) && mine && theirs
      ? Math.max(deliveryTime(mine.writtenAt), deliveryTime(theirs.writtenAt))
      : mine && deliveryTime(mine.writtenAt)
  return day ? `${ordinal(round)} 편지 · ${formatDay(day)}` : `${ordinal(round)} 편지`
}

/** 매칭 카드의 상태 한마디와 진행 표시 */
export function cardStatus(match: Match, now: Date) {
  const { status, progress } = MATCHING_COPY
  const phase = matchPhase(match, now)
  if (phase === 'diary') {
    const round = currentRound(match, now)
    const state = roundState(match, round, now)
    const label = { arrived: status.arrived, 'my-turn': status.myTurn, waiting: status.waiting, opening: status.opening, open: status.waiting }[state]
    return { status: { label, tone: state === 'arrived' ? 'warm' : 'calm' }, progress: { done: round, label: `${round} / ${DIARY_ROUNDS}` } } as const
  }
  if (phase === 'decide') {
    const decided = match.myDecision === 'yes'
    return {
      status: { label: decided ? status.decided : status.decide, tone: decided ? 'calm' : 'warm' },
      progress: { done: DIARY_ROUNDS, label: progress.allLetters },
    } as const
  }
  if (phase === 'meeting') {
    return match.meeting
      ? ({ status: { label: formatMeeting(match.meeting.at), tone: 'calm' }, progress: { done: DIARY_ROUNDS, label: progress.meeting } } as const)
      : ({ status: { label: status.pickTime, tone: 'warm' }, progress: { done: DIARY_ROUNDS, label: progress.pickTime } } as const)
  }
  return { status: { label: status.closed, tone: 'calm' }, progress: undefined } as const
}
