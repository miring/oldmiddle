import type { Ref } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar'
import { RadioOption } from '../../components/ui/RadioOption/RadioOption'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { QUIZ_TOTAL, type QuizQuestion } from './questions'
import { setAnswer, useQuizAnswers } from './quizAnswers'
import { goHome } from './quizRoute'
import styles from './QuizParts.module.css'

// 랜딩 히어로의 첫 질문, 문항 화면, 결과 화면이 함께 쓰는 조각들입니다. 바깥 여백은 쓰는 쪽에서 정합니다.

/** 문항·결과 화면 상단 바 */
export function QuizHeader() {
  return <SiteHeader fixed onHomeClick={goHome} aside={<p className={styles.headerLabel}>마음 알아보기</p>} />
}

export function QuizProgress({ step }: { step: number }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className={styles.progress}>
          <span className={styles.progressCurrent}>{String(step).padStart(2, '0')}</span> / {QUIZ_TOTAL}
        </p>
        <p className={styles.instruction}>한 가지를 골라주세요</p>
      </div>
      <ProgressBar value={step} max={QUIZ_TOTAL} label="질문 진행" />
    </div>
  )
}

type QuizChoicesProps = {
  question: QuizQuestion
  /** 문항이 바뀔 때 화면 읽기 프로그램이 질문부터 읽도록 포커스를 옮길 때 씁니다 */
  headingRef?: Ref<HTMLHeadingElement>
}

export function QuizChoices({ question, headingRef }: QuizChoicesProps) {
  const answers = useQuizAnswers()
  const headingId = `question-${question.id}`

  return (
    <div className="flex flex-col gap-6">
      <h2 id={headingId} ref={headingRef} tabIndex={-1} className={styles.question}>
        {question.text}
      </h2>
      <div role="radiogroup" aria-labelledby={headingId} className="flex flex-col gap-3">
        {question.choices.map((choice) => (
          <RadioOption
            key={choice.id}
            name={question.id}
            value={choice.id}
            label={choice.label}
            checked={answers[question.id] === choice.id}
            onChange={(choiceId) => setAnswer(question.id, choiceId)}
          />
        ))}
      </div>
    </div>
  )
}

type QuizActionsProps = {
  step: number
  canProceed: boolean
  onNext: () => void
  /** 없으면 '이전' 버튼을 숨깁니다(첫 문항) */
  onPrev?: () => void
}

export function QuizActions({ step, canProceed, onNext, onPrev }: QuizActionsProps) {
  const isLast = step === QUIZ_TOTAL

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-3">
        {onPrev && (
          <div className="w-25 shrink-0">
            <Button variant="secondary" arrow="back" onClick={onPrev}>
              이전
            </Button>
          </div>
        )}
        <div className="min-w-0 flex-1">
          {/* 고르기 전에는 비활성 */}
          <Button arrow="forward" disabled={!canProceed} onClick={onNext}>
            {isLast ? '내 결과 보기' : '다음'}
          </Button>
        </div>
      </div>
      <p className={styles.reassurance}>내 결과는 가입 없이 확인해요</p>
      {isLast && (
        <p className={`${styles.disclaimer} pt-4`}>
          이 테스트는 재미로 즐기는 성향 테스트이며, 전문 심리검사를 대신하지 않습니다.
        </p>
      )}
    </div>
  )
}
