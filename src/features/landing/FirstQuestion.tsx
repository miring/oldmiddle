import { useState } from 'react'
import { ChoiceCard } from '../../components/ui/ChoiceCard/ChoiceCard'
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar'
import { QUIZ_TOTAL, firstQuestion } from './quizData'
import styles from './FirstQuestion.module.css'

const questionNumber = 1

/** 히어로 안의 첫 질문. 다음 문항으로 넘어가는 흐름은 다음 단계에서 연결합니다. */
export function FirstQuestion() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`${styles.card} flex flex-col gap-4 pt-7 md:gap-5 md:p-8 xl:w-(--size-quiz-card-width) xl:shrink-0`}>
      <div className="flex items-center justify-between">
        <p className={styles.progressNumber}>
          {pad(questionNumber)} / {QUIZ_TOTAL}
        </p>
        <p className={styles.instruction}>마음이 가는 쪽을 골라보세요</p>
      </div>
      <ProgressBar value={questionNumber} max={QUIZ_TOTAL} label="질문 진행" />

      <h2 id="first-question" className={styles.question}>
        {firstQuestion.text}
      </h2>
      <div role="group" aria-labelledby="first-question" className="flex gap-3 md:gap-4">
        {firstQuestion.choices.map((choice, index) => (
          <div key={choice.id} className="flex min-w-0 flex-1">
            <ChoiceCard
              label={choice.label}
              illustration={choice.illustration}
              selected={selectedId === choice.id}
              sway={index === 0}
              onSelect={() => setSelectedId(choice.id)}
            />
          </div>
        ))}
      </div>

      {/* 모바일·태블릿: 가운데 정렬 문장 */}
      <p className={`${styles.reassurance} text-center xl:hidden`}>
        10가지 질문 · <strong className={styles.emphasis}>내 결과는 가입 없이 확인</strong>
      </p>
      {/* 데스크톱: 강조 알약 */}
      <p className={`${styles.reassurance} hidden items-center gap-1.5 xl:flex`}>
        10가지 질문 ·
        <span className={`${styles.pill} flex items-center gap-1.5 px-2.5 py-1`}>
          <span className={styles.pillAccent}>가입 없이</span>
          <span>내 결과 확인</span>
        </span>
      </p>
    </div>
  )
}
