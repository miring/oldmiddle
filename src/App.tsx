import { useEffect } from 'react'
import { LandingPage } from './features/landing/LandingPage'
import { PreregisterDonePage } from './features/preregister/PreregisterDonePage'
import { PreregisterPage } from './features/preregister/PreregisterPage'
import { Under45Page } from './features/preregister/Under45Page'
import { firstUnansweredStep, useQuizAnswers } from './features/quiz/quizAnswers'
import { QuizPage } from './features/quiz/QuizPage'
import { navigate, quizHash, useQuizRoute } from './features/quiz/quizRoute'
import { ResultPage } from './features/quiz/ResultPage'
import { calculateResult } from './features/quiz/results'

export function App() {
  const route = useQuizRoute()
  const answers = useQuizAnswers()
  const missingStep = firstUnansweredStep(answers)

  // 앞 문항을 건너뛰고 들어오면(주소 직접 입력 등) 아직 답하지 않은 첫 문항으로 보냅니다.
  // 결과 화면도 10문항을 모두 답해야 볼 수 있습니다.
  const requestedStep = route.view === 'quiz' ? route.step : route.view === 'result' ? Infinity : null
  const step =
    requestedStep !== null && missingStep !== null ? Math.min(requestedStep, missingStep) : requestedStep

  useEffect(() => {
    if (requestedStep !== null && step !== null && step !== requestedStep) {
      navigate(quizHash(step), { replace: true })
    }
  }, [requestedStep, step])

  if (route.view === 'preregister') return <PreregisterPage />
  if (route.view === 'under45') return <Under45Page />
  if (route.view === 'done') return <PreregisterDonePage />
  if (route.view === 'result' && missingStep === null) {
    const result = calculateResult(answers)
    if (result) return <ResultPage type={result} />
  }
  if (step !== null && Number.isFinite(step)) return <QuizPage step={step} />
  return <LandingPage />
}
