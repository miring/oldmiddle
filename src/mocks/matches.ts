import type { Decision, DiaryEntry, DiaryQuestion, Match, Member } from '../features/matching/matchTypes'

/*
 * 나의 매칭 더미 데이터 (화면 확인용). 화면은 아래 함수로만 읽고 씁니다.
 * TODO(저장 로직): Supabase를 붙일 때 이 파일만 같은 함수 이름으로 바꿉니다.
 *   - 읽기: matches · diary_entries 테이블
 *   - 쓰기: saveDiaryEntry · saveDecision은 서버 함수 하나에서 한 트랜잭션으로 (상태 변경이 어긋나지 않게)
 *   - 7일 기한 마무리는 서버 예약 작업으로 (지금은 화면에서 시각으로 계산)
 */

const at = (monthDay: string, time: string) => `2026-${monthDay}T${time}:00+09:00`

const Q = {
  walk: { text: '요즘 가장 좋아하는 산책길은 어디예요?', short: '좋아하는 산책길' },
  morning: { text: '쉬는 날 아침에는 주로 무엇을 하세요?', short: '쉬는 날 아침' },
  place: { text: '함께 가 보고 싶은 곳이 있다면?', short: '함께 가 보고 싶은 곳' },
  laugh: { text: '최근에 웃었던 일 하나를 들려주세요.', short: '최근에 웃었던 일' },
} satisfies Record<string, DiaryQuestion>

const QUESTIONS = [Q.walk, Q.morning, Q.place]

/** 세 번의 편지를 모두 나눈 기록 (의향 확인 이후 단계용) */
function threeRounds(days: [string, string, string]): DiaryEntry[] {
  const answers: [string, string][] = [
    ['집 앞 하천길이요. 저녁마다 30분씩 걸어요.', '석촌호수를 한 바퀴 돌아요. 벚꽃 필 때가 제일 좋아요.'],
    ['라디오를 켜 두고 천천히 아침을 차려요.', '동네 목욕탕에 갔다가 국밥 한 그릇 먹어요.'],
    ['덕수궁 돌담길을 같이 걸어 보고 싶어요.', '양평 두물머리에서 해 지는 걸 보고 싶어요.'],
  ]
  return days.flatMap((day, index) => [
    { round: index + 1, author: 'me' as const, answer: answers[index][0], writtenAt: at(day, '19:00') },
    { round: index + 1, author: 'partner' as const, answer: answers[index][1], writtenAt: at(day, '21:00') },
  ])
}

const SEED: Match[] = [
  // 교환일기 중 · 2/3 · 상대 편지가 도착했고 내 답을 기다림
  {
    id: 'kim',
    partner: { familyName: '김', ageBand: '50대 초반', district: '마포구' },
    startedAt: at('10-31', '10:00'),
    questions: QUESTIONS,
    entries: [
      { round: 1, author: 'me', answer: '집 앞 하천길이요. 저녁마다 30분씩 걸어요.', writtenAt: at('11-01', '19:00') },
      { round: 1, author: 'partner', answer: '남산 둘레길을 좋아해요. 가을 단풍이 참 예뻐요.', writtenAt: at('11-01', '21:00') },
      {
        round: 2,
        author: 'partner',
        answer: '일찍 일어나 시장 구경을 가요. 제철 과일 고르는 게 즐거워요.',
        extra: '요즘은 귤이 달아요.',
        writtenAt: at('11-02', '20:00'),
      },
    ],
  },
  // 교환일기 중 · 1/3 · 첫 질문이 열렸고 아직 아무도 쓰지 않음
  {
    id: 'lee',
    partner: { familyName: '이', ageBand: '40대 후반', district: '서대문구' },
    startedAt: at('11-02', '20:00'),
    questions: [Q.laugh, Q.morning, Q.place],
    entries: [],
  },
  // 교환일기 중 · 3/3 · 내가 먼저 답했고 상대 답을 기다림 (잠김)
  {
    id: 'choi',
    partner: { familyName: '최', ageBand: '50대 후반', district: '송파구' },
    startedAt: at('10-30', '12:00'),
    questions: QUESTIONS,
    entries: [
      ...threeRounds(['10-30', '10-31', '11-01']).filter((entry) => entry.round < 3),
      { round: 3, author: 'me', answer: '덕수궁 돌담길을 같이 걸어 보고 싶어요.', writtenAt: at('11-02', '21:00') },
    ],
  },
  // 교환일기 중 · 1/3 · 두 사람 모두 답했고 내일 아침 8시에 열림
  {
    id: 'han',
    partner: { familyName: '한', ageBand: '40대 후반', district: '강동구' },
    startedAt: at('11-02', '12:00'),
    questions: QUESTIONS,
    entries: [
      { round: 1, author: 'partner', answer: '한강 자전거길이요. 주말마다 달려요.', writtenAt: at('11-02', '22:00') },
      { round: 1, author: 'me', answer: '경의선 숲길을 자주 걸어요.', writtenAt: at('11-03', '09:00') },
    ],
  },
  // 의향 확인 · 아직 고르지 않음
  {
    id: 'seo',
    partner: { familyName: '서', ageBand: '50대 초반', district: '용산구' },
    startedAt: at('10-27', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-28', '10-29', '10-30']),
  },
  // 의향 확인 · 내가 '만나보고 싶어요'를 고르고 상대를 기다림
  {
    id: 'kang',
    partner: { familyName: '강', ageBand: '50대 중반', district: '성동구' },
    startedAt: at('10-26', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-27', '10-28', '10-29']),
    myDecision: 'yes',
  },
  // 약속 잡기 · 약속 확정
  {
    id: 'park',
    partner: { familyName: '박', ageBand: '50대 중반', district: '은평구' },
    startedAt: at('10-24', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-25', '10-26', '10-27']),
    myDecision: 'yes',
    partnerDecision: 'yes',
    meeting: { at: at('11-15', '14:00'), place: '연희동 공개 카페' },
  },
  // 약속 잡기 · 만날 시간을 아직 고르지 않음
  {
    id: 'song',
    partner: { familyName: '송', ageBand: '40대 후반', district: '광진구' },
    startedAt: at('10-25', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-26', '10-27', '10-28']),
    myDecision: 'yes',
    partnerDecision: 'yes',
  },
  // 마무리 · 7일 기한이 지나 조용히 끝남
  {
    id: 'yoon',
    partner: { familyName: '윤', ageBand: '50대 초반', district: '동작구' },
    startedAt: at('10-20', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-21', '10-22', '10-23']).filter((entry) => entry.round === 1),
  },
  // 보관함 · 이미 만남
  {
    id: 'jung',
    partner: { familyName: '정', ageBand: '50대 초반', district: '중구' },
    startedAt: at('10-15', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-16', '10-17', '10-18']),
    myDecision: 'yes',
    partnerDecision: 'yes',
    meeting: { at: at('10-25', '14:00'), place: '정동 공개 카페' },
  },
  {
    id: 'oh',
    partner: { familyName: '오', ageBand: '40대 후반', district: '종로구' },
    startedAt: at('10-08', '20:00'),
    questions: QUESTIONS,
    entries: threeRounds(['10-09', '10-10', '10-11']),
    myDecision: 'yes',
    partnerDecision: 'yes',
    meeting: { at: at('10-18', '15:00'), place: '삼청동 공개 카페' },
  },
]

const ME: Member = { id: 'me', name: '이수진' }

/** 더미 데이터의 기준 시각. 미리보기 설정에서 바꿔 볼 수 있습니다 */
export const DEFAULT_MOCK_NOW = at('11-03', '10:00')

/** all: 모든 상태 / no-matches: 매칭 0건 / no-archive: 보관함 0건 */
export type MockScenario = 'all' | 'no-matches' | 'no-archive'

let matches: Match[] = structuredClone(SEED)
let scenario: MockScenario = 'all'
let now = DEFAULT_MOCK_NOW
let version = 0
const listeners = new Set<() => void>()

function changed() {
  version += 1
  listeners.forEach((listener) => listener())
}

export function subscribeMatches(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** 데이터가 바뀔 때마다 달라지는 값 (useSyncExternalStore용) */
export function getMatchesVersion() {
  return version
}

export function getMe(): Member {
  return ME
}

/** 지금 시각. 저장 로직에서는 서버 시각을 씁니다 */
export function getNow(): Date {
  return new Date(now)
}

export function getMatches(): Match[] {
  if (scenario === 'no-matches') return []
  if (scenario === 'no-archive') return matches.filter((match) => !match.meeting || Date.parse(match.meeting.at) > Date.parse(now))
  return matches
}

export function getMatch(id: string): Match | undefined {
  return getMatches().find((match) => match.id === id)
}

/** 내 편지 저장. 상대에게는 다음 날 아침 8시에 전달됩니다 */
export function saveDiaryEntry(matchId: string, entry: Omit<DiaryEntry, 'author' | 'writtenAt'>) {
  matches = matches.map((match) =>
    match.id === matchId ? { ...match, entries: [...match.entries, { ...entry, author: 'me', writtenAt: now }] } : match,
  )
  changed()
}

/** 의향 저장. '이번엔 여기까지'(no)는 상대에게 알리지 않습니다 */
export function saveDecision(matchId: string, decision: Decision) {
  matches = matches.map((match) => (match.id === matchId ? { ...match, myDecision: decision } : match))
  changed()
}

/** 미리보기 설정: 상태 묶음과 기준 시각 바꾸기. 쓴 편지·고른 의향은 처음으로 되돌립니다 */
export function setMockOptions(options: { scenario?: MockScenario; now?: string }) {
  if (options.scenario) scenario = options.scenario
  if (options.now) now = options.now
  matches = structuredClone(SEED)
  changed()
}

export function getMockOptions() {
  return { scenario, now }
}
