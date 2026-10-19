import { useSyncExternalStore } from 'react'
import { QUESTIONS } from './questions'

/** 문항 id → 고른 선택지 id */
export type QuizAnswers = Record<string, string>

// 같은 탭 안에서만 유지됩니다(새로고침 대비). 테스트 답만 담고 개인정보는 넣지 않습니다.
const STORAGE_KEY = 'quiz-answers'

let answers: QuizAnswers = load()
const listeners = new Set<() => void>()

function load(): QuizAnswers {
  try {
    const parsed: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? '{}')
    return parsed && typeof parsed === 'object' ? (parsed as QuizAnswers) : {}
  } catch {
    return {}
  }
}

export function setAnswer(questionId: string, choiceId: string) {
  answers = { ...answers, [questionId]: choiceId }
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // 저장이 막힌 환경(사생활 보호 모드 등)에서는 화면 상태만 유지합니다.
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useQuizAnswers(): QuizAnswers {
  return useSyncExternalStore(subscribe, () => answers)
}

/** 아직 답하지 않은 첫 문항 번호(1부터). 모두 답했으면 null */
export function firstUnansweredStep(current: QuizAnswers): number | null {
  const index = QUESTIONS.findIndex((question) => !current[question.id])
  return index === -1 ? null : index + 1
}
