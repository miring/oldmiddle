import type { KeptPerson, MutualMatch, Recommendation, RecommendResponse } from '../features/matching/recommendTypes'
import { getNow } from './matches'
import { spendRecommendation } from './myInfo'

/*
 * 오늘의 추천 더미 데이터 (화면 확인용). 화면은 아래 함수로만 읽고 씁니다.
 * TODO(저장 로직): 매칭 시스템을 붙일 때 이 파일만 같은 함수 이름으로 바꿉니다.
 *   - 추천은 매칭 풀 필터 안에서 무작위로 1명 (기획서 7장). 외모·직업·소득으로 정렬하지 않습니다
 *   - 담기는 likes 테이블 (두 회원 ID 쌍에 고유 제약, 한 트랜잭션), 쌍방 매칭은 반대 방향 행이 있을 때
 *   - TODO(여성 먼저 수락, 기획서 7장·8장): 성별 정보가 생기면 쌍방 매칭·[만나볼게요] 확인을 여성 쪽에 먼저 받고 남성에게 알립니다
 *   - '다음에요'를 고른 사람은 6개월 동안 추천에서 뺍니다
 */

const POOL: Recommendation[] = [
  {
    id: 'rec-moon',
    partner: { familyName: '문', ageBand: '50대 중반', district: '서대문구' },
    photoCount: 3,
    intro: '삼십 년 다닌 회사를 그만두고 요즘은 동네 사진 동아리에서 골목 풍경을 찍어요. 주말 아침에 같이 걸으며 이야기 나눌 분이면 좋겠어요.',
    hobbies: ['둘레길 걷기', '텃밭 가꾸기', '사진 찍기'],
    values: [
      '토요일 아침엔 산에 가고, 오후엔 책을 읽어요.',
      '아침마다 스트레칭을 하고 계단으로 다녀요.',
      '딸 가족과 가까이 살아서 자주 봐요.',
      '서로의 생활을 존중하면서 자주 웃는 사이요.',
      '필요한 데는 쓰고, 나머지는 모아 두는 편이에요.',
    ],
    purpose: 'companion',
    singleVerifiedMonth: '2026-10',
    hasVoiceIntro: true,
  },
  {
    id: 'rec-bae',
    partner: { familyName: '배', ageBand: '50대 초반', district: '마포구' },
    photoCount: 2,
    intro: '평일엔 작은 꽃집을 하고, 쉬는 날엔 동네 도서관에 가요. 말이 잘 통하는 친구 같은 사이부터 천천히 알아 가고 싶어요.',
    hobbies: ['꽃꽂이', '동네 맛집 찾기', '그림 그리기'],
    values: [
      '쉬는 날엔 도서관에서 반나절을 보내요.',
      '매일 30분 걷고, 해마다 건강검진을 받아요.',
      '어머니를 모시고 살아요.',
      '천천히 친구처럼 가까워지는 사이요.',
      '쓸 때는 쓰고, 노후 준비는 꾸준히 해 왔어요.',
    ],
    purpose: 'friends-first',
    singleVerifiedMonth: null,
    hasVoiceIntro: false,
  },
  {
    id: 'rec-jo',
    partner: { familyName: '조', ageBand: '60대 초반', district: '노원구' },
    photoCount: 3,
    intro: '퇴직하고 수영을 배우기 시작했어요. 아침 수영 뒤 마시는 커피를 좋아해요. 함께 여행도 다니고 일상을 나눌 분을 찾고 있어요.',
    hobbies: ['수영', '사진 찍기', '국내 여행'],
    values: [
      '아침엔 수영, 오후엔 손주와 놀아 줘요.',
      '수영을 일주일에 세 번 해요.',
      '독립한 아들과 한 달에 한 번 밥을 먹어요.',
      '일상을 함께 꾸려 가는 사이요.',
      '여행에는 아끼지 않고 써요.',
    ],
    purpose: 'serious',
    singleVerifiedMonth: '2026-11',
    hasVoiceIntro: true,
  },
]

/** 예전 회차에 담아 둔 사람 (더미) */
const KEPT_SEED: KeptPerson[] = [
  {
    recommendation: {
      id: 'rec-an',
      partner: { familyName: '안', ageBand: '50대 후반', district: '은평구' },
      photoCount: 2,
      intro: '산을 좋아해요.',
      hobbies: ['등산', '바둑', '요리'],
      values: ['', '', '', '', ''],
      purpose: 'companion',
      singleVerifiedMonth: null,
      hasVoiceIntro: false,
    },
    keptAt: '2026-10-20T20:30:00+09:00',
  },
  {
    recommendation: {
      id: 'rec-hwang',
      partner: { familyName: '황', ageBand: '50대 초반', district: '용산구' },
      photoCount: 3,
      intro: '음악회를 자주 가요.',
      hobbies: ['음악회 가기', '산책', '사진 찍기'],
      values: ['', '', '', '', ''],
      purpose: 'serious',
      singleVerifiedMonth: '2026-09',
      hasVoiceIntro: false,
    },
    keptAt: '2026-10-27T21:00:00+09:00',
  },
]

const DAY = 24 * 60 * 60 * 1000
const WEEK = 7 * DAY
const KST_OFFSET = 9 * 60 * 60 * 1000

let responses = new Map<number, RecommendResponse>()
let kept: KeptPerson[] = structuredClone(KEPT_SEED)
let mutual: MutualMatch | null = null
let version = 0
const listeners = new Set<() => void>()

function changed() {
  version += 1
  listeners.forEach((listener) => listener())
}

export function subscribeRecommend(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** 데이터가 바뀔 때마다 달라지는 값 (useSyncExternalStore용) */
export function getRecommendVersion() {
  return version
}

/** 그 회차(공개 시각)의 추천 1명. 더미라 회차 순서(주마다 화·금)대로 돌아가며 고릅니다 */
export function getRoundRecommendation(revealedAt: number): Recommendation {
  const isFriday = new Date(revealedAt + KST_OFFSET).getUTCDay() === 5
  // 1970-01-05(월)부터 센 주 번호. 같은 주의 화·금이 이어진 회차가 되게 합니다
  const round = Math.floor((revealedAt + KST_OFFSET - 4 * DAY) / WEEK) * 2 + (isFriday ? 1 : 0)
  return POOL[round % POOL.length]
}

export function getResponse(revealedAt: number): RecommendResponse | undefined {
  return responses.get(revealedAt)
}

/** 이번 회차 추천에 답하기. 답하면 이번 달 추천 1회를 씁니다 (기한 안에 답하지 않으면 쓰지 않음) */
export function respond(revealedAt: number, response: RecommendResponse) {
  if (responses.has(revealedAt)) return
  responses = new Map(responses).set(revealedAt, response)
  if (response.kind === 'keep') kept = [...kept, { recommendation: getRoundRecommendation(revealedAt), keptAt: getNow().toISOString() }]
  spendRecommendation()
  changed()
}

export function getKept(): KeptPerson[] {
  return kept
}

/** 담은 목록에서 빼기 (상대에게 알리지 않음) */
export function removeKept(id: string) {
  kept = kept.filter((person) => person.recommendation.id !== id)
  changed()
}

export function getMutual(): MutualMatch | null {
  return mutual
}

/** [만나볼게요]를 눌렀거나 기한이 지나 쌍방 매칭 안내를 닫습니다 */
export function clearMutual() {
  mutual = null
  changed()
}

/** 미리보기 설정: 서로 마음에 담은 분 만들기 (담은 목록의 첫 사람, 없으면 추천 목록에서) */
export function setMockMutual() {
  const person = kept[0]?.recommendation ?? POOL[0]
  kept = kept.filter((item) => item.recommendation.id !== person.id)
  mutual = { recommendation: person, matchedAt: getNow().toISOString() }
  changed()
}

/** 미리보기 설정: 처음 상태로 */
export function resetRecommend() {
  responses = new Map()
  kept = structuredClone(KEPT_SEED)
  mutual = null
  changed()
}
