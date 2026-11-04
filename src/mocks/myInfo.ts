import type { Availability, MyInfo } from '../features/matching/myInfoTypes'

/*
 * '내 정보' 더미 데이터 (화면 확인용). 화면은 아래 함수로만 읽고 씁니다.
 * TODO(저장 로직): Supabase를 붙일 때 이 파일만 같은 함수 이름으로 바꿉니다.
 *   - 만날 수 있는 때는 profiles.available_days · available_bands에 저장하고, 약속 탭의 시간 후보를 여기서 만듭니다
 */

const SEED: MyInfo = {
  photos: [
    { id: 'photo-1', status: 'public' },
    { id: 'photo-2', status: 'public' },
    { id: 'photo-3', status: 'reviewing' },
  ],
  intro: '은퇴 뒤 동네 도서관에서 책 읽어 주는 봉사를 해요. 천천히 이야기 나눌 분을 만나고 싶어요.',
  hobbies: ['둘레길 걷기', '사진 찍기', '동네 맛집 찾기'],
  values: [
    '토요일 아침엔 산에 가고, 오후엔 책을 읽어요.',
    '매일 30분 걷고, 해마다 건강검진을 받아요.',
    '독립한 아들과 한 달에 한 번 밥을 먹어요.',
    '서로의 생활을 존중하면서 자주 웃는 사이요.',
    '쓸 때는 쓰고, 노후 준비는 꾸준히 해 왔어요.',
  ],
  purpose: 'companion',
  loveType: 'B',
  singleVerifiedMonth: '2026-11',
  availability: { available_days: ['sat', 'sun'], available_bands: ['late_morning', 'afternoon'] },
  preferences: { ageMin: 52, ageMax: 66, smoking: 'non-smoker', verifiedOnly: true },
  plan: { id: 'standard', recommendLeft: 5, meetingLeft: 1, nextBillingDate: '2026-12-03' },
  notifyDayOnly: false,
}

let info: MyInfo = structuredClone(SEED)
let version = 0
const listeners = new Set<() => void>()

function changed() {
  version += 1
  listeners.forEach((listener) => listener())
}

export function subscribeMyInfo(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** 데이터가 바뀔 때마다 달라지는 값 (useSyncExternalStore용) */
export function getMyInfoVersion() {
  return version
}

export function getMyInfo(): MyInfo {
  return info
}

/** 만날 수 있는 때 저장 */
export function saveAvailability(availability: Availability) {
  info = { ...info, availability }
  changed()
}

/** 미리보기 설정: 독신 확인 제출 여부 바꾸기 */
export function setMockSingleVerified(verified: boolean) {
  info = { ...info, singleVerifiedMonth: verified ? SEED.singleVerifiedMonth : null }
  changed()
}

/** 미리보기 설정: 처음 상태로 */
export function resetMyInfo() {
  info = structuredClone(SEED)
  changed()
}
