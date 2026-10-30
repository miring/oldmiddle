import { useSyncExternalStore } from 'react'
import { site } from '../../config/site'
import { QUIZ_TOTAL } from './questions'
import { clearAnswers } from './quizAnswers'

/*
 * 화면 이동은 주소의 # 뒤(#/quiz/3)로 구분합니다. 라우터 라이브러리 없이 동작하고,
 * 문항마다 방문 기록이 남아 휴대폰 '뒤로 가기'로도 이전 문항으로 돌아갈 수 있습니다.
 */

export type QuizRoute =
  | { view: 'landing' }
  | { view: 'home' }
  | { view: 'quiz'; step: number }
  | { view: 'result' }
  | { view: 'preregister' }
  | { view: 'under45' }
  | { view: 'done' }
  | { view: 'cancel'; token: string }

const NAVIGATE_EVENT = 'quiz:navigate'

/** 정식 홈 미리보기 (오픈 전에는 개발 서버에서만 열림) */
export const HOME_HASH = '#/home'
/** 테스트 공유 링크. 랜딩을 보여 줍니다 (오픈 뒤 첫 화면이 정식 홈으로 바뀌어도 테스트로 들어오도록) */
export const TEST_HASH = '#/test'
/** 정식 홈의 가입하기·로그인. 화면이 생기기 전까지 이동할 주소만 정해 둡니다 */
export const SIGNUP_HASH = '#/signup'
export const LOGIN_HASH = '#/login'
export const RESULT_HASH = '#/result'
export const PREREGISTER_HASH = '#/preregister'
export const UNDER45_HASH = '#/preregister/under45'
export const DONE_HASH = '#/preregister/done'

/** 신청 취소 링크: #/cancel/<취소 토큰>. # 뒤는 서버로 전송되지 않아 토큰이 접속 기록에 남지 않습니다 */
export function cancelHash(token: string) {
  return `#/cancel/${token}`
}

export function quizHash(step: number) {
  return `#/quiz/${step}`
}

/** 오픈 전 #/home 미리보기: 개발 서버, 또는 VITE_HOME_PREVIEW=true로 빌드한 외부 확인용 배포(Vercel Preview)에서만 */
const HOME_PREVIEW = import.meta.env.DEV || import.meta.env.VITE_HOME_PREVIEW === 'true'

/** 오픈 뒤에는 첫 화면이 정식 홈. 오픈 전에는 미리보기 환경의 #/home에서만 열고, 운영 사이트에서는 랜딩을 보여 줍니다 */
function parseHome(hash: string): QuizRoute | null {
  if (site.siteMode === 'open') return hash === '' || hash === HOME_HASH ? { view: 'home' } : null
  return hash === HOME_HASH && HOME_PREVIEW ? { view: 'home' } : null
}

function parse(hash: string): QuizRoute {
  const home = parseHome(hash)
  if (home) return home
  if (hash === TEST_HASH) return { view: 'landing' }
  if (hash === RESULT_HASH) return { view: 'result' }
  if (hash === PREREGISTER_HASH) return { view: 'preregister' }
  if (hash === UNDER45_HASH) return { view: 'under45' }
  if (hash === DONE_HASH) return { view: 'done' }
  const cancel = /^#\/cancel\/([0-9a-f-]{36})$/i.exec(hash)
  if (cancel) return { view: 'cancel', token: cancel[1] }
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

// 랜딩으로 가며 보여 줄 섹션 (주소의 #은 화면 구분에 쓰므로 섹션 이동은 따로 전달)
let pendingLandingSection: string | null = null

/** 첫 화면(랜딩)으로 가서 해당 id의 섹션부터 보여 줍니다. 테스트 답은 지우지 않습니다. */
export function goToLandingSection(sectionId: string) {
  pendingLandingSection = sectionId
  navigate(`${window.location.pathname}${window.location.search}`)
}

/** 랜딩이 그려진 뒤 한 번 꺼내 씀 */
export function takePendingLandingSection(): string | null {
  const sectionId = pendingLandingSection
  pendingLandingSection = null
  return sectionId
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
