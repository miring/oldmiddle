import { useSyncExternalStore } from 'react'
import { QUIZ_TOTAL } from './questions'
import { clearAnswers } from './quizAnswers'

/*
 * 화면 이동은 주소의 # 뒤(#/quiz/3)로 구분합니다. 라우터 라이브러리 없이 동작하고,
 * 문항마다 방문 기록이 남아 휴대폰 '뒤로 가기'로도 이전 문항으로 돌아갈 수 있습니다.
 */

export type QuizRoute =
  | { view: 'landing' }
  | { view: 'quiz'; step: number }
  | { view: 'result' }
  | { view: 'preregister' }
  | { view: 'under45' }
  | { view: 'done' }

const NAVIGATE_EVENT = 'quiz:navigate'

export const RESULT_HASH = '#/result'
export const PREREGISTER_HASH = '#/preregister'
export const UNDER45_HASH = '#/preregister/under45'
export const DONE_HASH = '#/preregister/done'

export function quizHash(step: number) {
  return `#/quiz/${step}`
}

function parse(hash: string): QuizRoute {
  if (hash === RESULT_HASH) return { view: 'result' }
  if (hash === PREREGISTER_HASH) return { view: 'preregister' }
  if (hash === UNDER45_HASH) return { view: 'under45' }
  if (hash === DONE_HASH) return { view: 'done' }
  const match = /^#\/quiz\/(\d+)$/.exec(hash)
  if (!match) return { view: 'landing' }
  const step = Math.min(Math.max(Number(match[1]), 1), QUIZ_TOTAL)
  return { view: 'quiz', step }
}

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener)
  window.addEventListener('hashchange', listener)
  window.addEventListener(NAVIGATE_EVENT, listener)
  return () => {
    window.removeEventListener('popstate', listener)
    window.removeEventListener('hashchange', listener)
    window.removeEventListener(NAVIGATE_EVENT, listener)
  }
}

export function useQuizRoute(): QuizRoute {
  const hash = useSyncExternalStore(subscribe, () => window.location.hash)
  return parse(hash)
}

/** 앱 안에서 이동합니다. 이동한 기록에는 inApp 표시를 남겨 '이전' 버튼이 참고합니다. */
export function navigate(hash: string, { replace = false } = {}) {
  const state = { inApp: true }
  if (replace) window.history.replaceState(state, '', hash)
  else window.history.pushState(state, '', hash)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}

/** 첫 화면(랜딩) 맨 위로. 이미 랜딩이면 기록을 늘리지 않고 위로만 올립니다. */
export function goHome() {
  if (window.location.hash) navigate(`${window.location.pathname}${window.location.search}`)
  window.scrollTo(0, 0)
}

/**
 * 랜딩에서 테스트 시작: 같은 탭에서 이전에 고른 답(세션 저장소)을 지우고 1번부터 시작합니다.
 * 테스트 도중 새로고침·뒤로 가기에서는 답이 그대로 남습니다.
 */
export function startQuiz() {
  clearAnswers()
  goToStep(1)
}

export function goToStep(step: number) {
  navigate(quizHash(step))
}

/**
 * '이전' 버튼: 앱 안에서 넘어온 경우 브라우저 기록을 한 칸 되돌리고(뒤로 가기와 같게),
 * 주소로 바로 들어온 경우에는 이전 문항으로 바꿔 보여 줍니다.
 */
export function goBackToStep(step: number) {
  goBackTo(quizHash(step))
}

/** 뒤로 가기 버튼 공통: 앱 안에서 넘어왔으면 기록을 한 칸 되돌리고, 아니면 fallback 화면으로 바꿉니다. */
export function goBackTo(fallbackHash: string) {
  const state: unknown = window.history.state
  if (state && typeof state === 'object' && 'inApp' in state) window.history.back()
  else navigate(fallbackHash, { replace: true })
}
