import { useEffect, useRef } from 'react'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { QUESTIONS, QUIZ_TOTAL } from './questions'
import { useQuizAnswers } from './quizAnswers'
import { QuizActions, QuizChoices, QuizProgress } from './QuizParts'
import { goBackToStep, goToStep } from './quizRoute'
import styles from './QuizPage.module.css'

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
    // 마지막 문항: 결과 화면 디자인이 나오면 여기서 결과로 이동합니다.
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader aside={<p className={styles.headerLabel}>마음 알아보기</p>} />
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col">
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
