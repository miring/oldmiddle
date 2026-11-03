import type { DiaryEntry, Match } from './matchTypes'

/*
 * 교환일기 규칙. 화면에 보일 상태는 저장하지 않고, 편지와 지금 시각으로 그때그때 계산합니다.
 * 시간은 ISO(시간대 포함)로 받고, '아침 8시'·날짜는 한국 시간 기준입니다.
 */

export const DIARY_ROUNDS = 3
export const DIARY_DAYS = 7
/** 답과 '한 줄 더'의 글자 수 한도 */
export const LETTER_MAX_LENGTH = 50

const HOUR = 60 * 60 * 1000
const DAY = 24 * HOUR
const KST_OFFSET = 9 * HOUR
const DELIVERY_HOUR = 8

/** 편지가 상대에게 전달되는 시각: 쓴 다음 날 아침 8시 (한국 시간) */
export function deliveryTime(writtenAt: string): number {
  const kst = new Date(Date.parse(writtenAt) + KST_OFFSET)
  return Date.UTC(kst.getUTCFullYear(), kst.getUTCMonth(), kst.getUTCDate() + 1, DELIVERY_HOUR) - KST_OFFSET
}

export function entryOf(match: Match, round: number, author: DiaryEntry['author']) {
  return match.entries.find((entry) => entry.round === round && entry.author === author)
}

/** 답 공개 여부: 두 사람의 답이 모두 있고, 두 편지 모두 전달 시각(다음 날 아침 8시)이 지났을 때 */
export function isRoundOpen(match: Match, round: number, now: Date): boolean {
  const mine = entryOf(match, round, 'me')
  const theirs = entryOf(match, round, 'partner')
  if (!mine || !theirs) return false
  return now.getTime() >= Math.max(deliveryTime(mine.writtenAt), deliveryTime(theirs.writtenAt))
}

/** 함께 열린 편지 수 (앞에서부터 차례로) */
export function openRounds(match: Match, now: Date): number {
  let count = 0
  while (count < DIARY_ROUNDS && isRoundOpen(match, count + 1, now)) count += 1
  return count
}

/** 지금 주고받는 편지 번호 (1~3) */
export function currentRound(match: Match, now: Date): number {
  return Math.min(openRounds(match, now) + 1, DIARY_ROUNDS)
}

export function diaryDeadline(match: Match): number {
  return Date.parse(match.startedAt) + DIARY_DAYS * DAY
}

/** 기한까지 남은 날 (하루가 안 남으면 0) */
export function daysLeft(match: Match, now: Date): number {
  return Math.max(0, Math.floor((diaryDeadline(match) - now.getTime()) / DAY))
}

/**
 * diary: 교환일기 중 / decide: 의향 확인 / meeting: 약속 잡기 / met: 만남 뒤(보관함) / closed: 마무리
 * 7일 안에 세 번의 편지가 다 열리지 않으면 조용히 마무리합니다 ("이번 인연은 여기까지예요").
 */
export type MatchPhase = 'diary' | 'decide' | 'meeting' | 'met' | 'closed'

export function matchPhase(match: Match, now: Date): MatchPhase {
  if (match.myDecision === 'no' || match.partnerDecision === 'no') return 'closed'
  if (match.myDecision === 'yes' && match.partnerDecision === 'yes') {
    return match.meeting && Date.parse(match.meeting.at) < now.getTime() ? 'met' : 'meeting'
  }
  if (openRounds(match, now) === DIARY_ROUNDS) return 'decide'
  return now.getTime() > diaryDeadline(match) ? 'closed' : 'diary'
}

/**
 * 지금 편지의 상태 (내 쪽에서 본 것)
 * - arrived: 상대 편지가 도착했고 내 답을 기다림 (내 답을 쓰면 다음 날 아침 함께 열림)
 * - my-turn: 내 답을 기다림 (상대가 썼는지는 알리지 않음)
 * - waiting: 내가 답했고 상대 답을 기다림
 * - opening: 둘 다 답했고 다음 날 아침 8시에 열림
 * - open: 함께 열림
 */
export type RoundState = 'arrived' | 'my-turn' | 'waiting' | 'opening' | 'open'

export function roundState(match: Match, round: number, now: Date): RoundState {
  if (isRoundOpen(match, round, now)) return 'open'
  const mine = entryOf(match, round, 'me')
  const theirs = entryOf(match, round, 'partner')
  const theirsDelivered = !!theirs && now.getTime() >= deliveryTime(theirs.writtenAt)
  if (!mine) return theirsDelivered ? 'arrived' : 'my-turn'
  return theirsDelivered ? 'opening' : 'waiting'
}

/** 지금 편지에 내가 답을 쓸 수 있는지 */
export function canWrite(match: Match, now: Date): boolean {
  return matchPhase(match, now) === 'diary' && !entryOf(match, currentRound(match, now), 'me')
}

/*
 * 보낼 수 없는 내용 (기획서 7장 한 줄 편지·교환일기, 8장 돈 이야기 차단)
 * TODO(저장 로직): 지금은 화면에서만 검사합니다. 화면 검사는 우회할 수 있으므로 서버에서도 같은 검사를 하고,
 *   걸린 글은 저장하지 않으며 운영자에게 알립니다.
 */
const PHONE_NUMBER = /01[016789][\s.-]?\d{3,4}[\s.-]?\d{4}/g
const BLOCKED_CONTENT = [
  { label: '카카오톡 ID', pattern: /카톡|카카오|kakao|오픈\s?채팅|아이디(?!어)|\bid\b/i },
  { label: '계좌번호', pattern: /계좌|\d{2,6}-\d{2,6}-\d{2,8}|\d{9,}/ },
  { label: '돈 이야기', pattern: /돈(?!가스|까스)|투자|코인|송금/ },
]

/** 걸린 항목 이름 목록 (없으면 빈 배열). 전화번호는 지운 뒤에 나머지를 봐서 계좌번호로 한 번 더 잡히지 않게 합니다 */
export function findBlockedContent(text: string): string[] {
  const withoutPhone = text.replace(PHONE_NUMBER, ' ')
  const labels = BLOCKED_CONTENT.filter(({ pattern }) => pattern.test(withoutPhone)).map(({ label }) => label)
  return withoutPhone === text ? labels : ['전화번호', ...labels]
}

/** 글자 수 (한글·이모지도 한 글자로) */
export function letterLength(text: string): number {
  return Array.from(text).length
}

export function clampLetter(text: string): string {
  return Array.from(text).slice(0, LETTER_MAX_LENGTH).join('')
}
