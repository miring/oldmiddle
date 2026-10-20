import { useEffect, useRef } from 'react'
import { QUESTIONS, QUIZ_TOTAL } from './questions'
import { useQuizAnswers } from './quizAnswers'
import { QuizActions, QuizChoices, QuizHeader, QuizProgress } from './QuizParts'
import { RESULT_HASH, goBackToStep, goToStep, navigate } from './quizRoute'

/** 문항 한 개를 한 화면에 보여 주는 테스트 화면 (Figma "마지막사랑 · 질문01~10") */
export function QuizPage({ step }: { step: number }) {
  const answers = useQuizAnswers()
  const question = QUESTIONS[step - 1]
  const headingRef = useRef<HTMLHeadingElement>(null)

  // 문항이 바뀌면 맨 위로 올리고, 화면 읽기 프로그램이 새 질문부터 읽도록 포커스를 옮깁니다.
  useEffect(() => {
    window.scrollTo(0, 0)
    headingRef.current?.focus()
  }, [step])

  const handleNext = () => {
    if (step < QUIZ_TOTAL) goToStep(step + 1)
    else navigate(RESULT_HASH)
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <QuizHeader />
      {/* 헤더가 화면 위에 고정되어 있어 그 높이만큼 내려서 시작합니다 */}
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col pt-(--size-header-height)">
        <div className="flex flex-1 flex-col gap-7 px-6 pt-7 pb-6">
          <QuizProgress step={step} />
          <QuizChoices question={question} headingRef={headingRef} />
        </div>
        <div className="px-6 pt-4 pb-7">
          <QuizActions
            step={step}
            canProceed={Boolean(answers[question.id])}
            onNext={handleNext}
            onPrev={step > 1 ? () => goBackToStep(step - 1) : undefined}
          />
        </div>
      </main>
    </div>
  )
}
