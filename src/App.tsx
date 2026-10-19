import { useEffect } from 'react'
import { LandingPage } from './features/landing/LandingPage'
import { firstUnansweredStep, useQuizAnswers } from './features/quiz/quizAnswers'
import { QuizPage } from './features/quiz/QuizPage'
import { navigate, quizHash, useQuizRoute } from './features/quiz/quizRoute'

export function App() {
  const route = useQuizRoute()
  const answers = useQuizAnswers()

  // 앞 문항을 건너뛰고 들어오면(주소 직접 입력 등) 아직 답하지 않은 첫 문항으로 보냅니다.
  const requestedStep = route.view === 'quiz' ? route.step : null
  const missingStep = firstUnansweredStep(answers)
  const step =
    requestedStep !== null && missingStep !== null ? Math.min(requestedStep, missingStep) : requestedStep

  useEffect(() => {
    if (requestedStep !== null && step !== null && step !== requestedStep) {
      navigate(quizHash(step), { replace: true })
    }
  }, [requestedStep, step])

  if (step !== null) return <QuizPage step={step} />
  return <LandingPage />
}
