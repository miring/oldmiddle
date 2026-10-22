import type { CompanionType } from '../quiz/results'

/**
 * 신청 완료 화면에 넘길 값. 저장소(세션·로컬 스토리지)에 남기지 않고 메모리에만 둡니다.
 * 새로고침하거나 주소로 바로 들어오면 비어 있고, 완료 화면은 기본 문구만 보여 줍니다.
 */
export type PreregisterDoneInfo = {
  /** 시·군·구 이름 (세종처럼 시·군·구가 없으면 시·도 이름) */
  regionName: string
  myType: CompanionType | null
  /** 같은 지역 신청자 수. 저장 로직이 없는 지금은 null (= 10명 미만 문구) */
  sameRegionCount: number | null
}

let doneInfo: PreregisterDoneInfo | null = null

export function setDoneInfo(info: PreregisterDoneInfo) {
  doneInfo = info
}

export function getDoneInfo(): PreregisterDoneInfo | null {
  return doneInfo
}
