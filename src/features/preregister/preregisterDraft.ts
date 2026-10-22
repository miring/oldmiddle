import { useSyncExternalStore } from 'react'

/**
 * 사전 신청 폼 입력값 (제출 전 임시 상태).
 * 저장소(세션·로컬 스토리지)에 남기지 않고 메모리에만 둡니다 — 새로고침하거나 탭을 닫으면 사라집니다.
 * 같은 탭에서 '45세 미만' 안내 화면에 다녀와도 값이 유지되도록 화면 바깥에 둡니다.
 */
export type PreregisterDraft = {
  gender: string | null
  age: string | null
  /** 시·도 코드 2자리 (법정동코드 앞 2자리, 예: '11'). 화면 이름은 저장하지 않고 regions.json에서 찾아 씀 */
  province: string
  /** 시·군·구 코드 5자리 (예: '11680'). 세종처럼 시·군·구가 없으면 시·도 코드를 그대로 넣음 (open_regions와 코드로 비교) */
  district: string
  phone: string
  codeRequested: boolean
  code: string
  consents: Record<string, boolean>
}

const EMPTY: PreregisterDraft = {
  gender: null,
  age: null,
  province: '',
  district: '',
  phone: '',
  codeRequested: false,
  code: '',
  consents: {},
}

let draft: PreregisterDraft = EMPTY
const listeners = new Set<() => void>()

/** 화면을 다시 그리지 않고 지금 값만 읽을 때 (예: 화면에 처음 들어올 때 한 번) */
export function getDraft(): PreregisterDraft {
  return draft
}

export function updateDraft(patch: Partial<PreregisterDraft>) {
  draft = { ...draft, ...patch }
  listeners.forEach((listener) => listener())
}

export function resetDraft() {
  draft = EMPTY
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function usePreregisterDraft(): PreregisterDraft {
  return useSyncExternalStore(subscribe, () => draft)
}
