import { useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { ProgressBar } from '../../components/ui/ProgressBar/ProgressBar'
import { RadioOption } from '../../components/ui/RadioOption/RadioOption'
import { QUIZ_TOTAL, firstQuestion } from './quizData'
import styles from './FirstQuestion.module.css'

const questionNumber = 1

/** 히어로 안의 첫 질문. 다음 문항으로 넘어가는 흐름은 다음 단계에서 연결합니다. */
export function FirstQuestion() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const pad = (n: number) => String(n).padStart(2, '0')

  return (
    <div className={`${styles.card} flex flex-col gap-5 pt-7 md:p-8 xl:w-(--size-quiz-card-width) xl:shrink-0`}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className={styles.progress}>
            <span className={styles.progressCurrent}>{pad(questionNumber)}</span> / {QUIZ_TOTAL}
          </p>
          <p className={styles.instruction}>한 가지를 골라주세요</p>
        </div>
        <ProgressBar value={questionNumber} max={QUIZ_TOTAL} label="질문 진행" />
      </div>

      <div className="flex flex-col gap-6">
        <h2 id="first-question" className={styles.question}>
          {firstQuestion.text}
        </h2>
        <div role="radiogroup" aria-labelledby="first-question" className="flex flex-col gap-3">
          {firstQuestion.choices.map((choice) => (
            <RadioOption
              key={choice.id}
              name={firstQuestion.id}
              value={choice.id}
              label={choice.label}
              checked={selectedId === choice.id}
              onChange={setSelectedId}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 pt-2">
        {/* 선택 전에는 비활성. 다음 문항 이동은 아직 연결하지 않았습니다 */}
        <Button trailingArrow disabled={selectedId === null}>
          다음
        </Button>
        <p className={styles.reassurance}>내 결과는 가입 없이 확인해요</p>
      </div>
    </div>
  )
}
