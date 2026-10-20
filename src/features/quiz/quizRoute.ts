import { useSyncExternalStore } from 'react'
import { QUIZ_TOTAL } from './questions'

/*
 * 화면 이동은 주소의 # 뒤(#/quiz/3)로 구분합니다. 라우터 라이브러리 없이 동작하고,
 * 문항마다 방문 기록이 남아 휴대폰 '뒤로 가기'로도 이전 문항으로 돌아갈 수 있습니다.
 */

export type QuizRoute = { view: 'landing' } | { view: 'quiz'; step: number } | { view: 'result' }

const NAVIGATE_EVENT = 'quiz:navigate'

export const RESULT_HASH = '#/result'

export function quizHash(step: number) {
  return `#/quiz/${step}`
}

function parse(hash: string): QuizRoute {
  if (hash === RESULT_HASH) return { view: 'result' }
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

export function goToStep(step: number) {
  navigate(quizHash(step))
}

/**
 * '이전' 버튼: 앱 안에서 넘어온 경우 브라우저 기록을 한 칸 되돌리고(뒤로 가기와 같게),
 * 주소로 바로 들어온 경우에는 이전 문항으로 바꿔 보여 줍니다.
 */
export function goBackToStep(step: number) {
  const state: unknown = window.history.state
  if (state && typeof state === 'object' && 'inApp' in state) window.history.back()
  else navigate(quizHash(step), { replace: true })
}
