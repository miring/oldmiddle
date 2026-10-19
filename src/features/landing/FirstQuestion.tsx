import { QUESTIONS } from '../quiz/questions'
import { useQuizAnswers } from '../quiz/quizAnswers'
import { QuizActions, QuizChoices, QuizProgress } from '../quiz/QuizParts'
import { goToStep } from '../quiz/quizRoute'
import styles from './FirstQuestion.module.css'

const firstQuestion = QUESTIONS[0]

/** 히어로 안의 첫 질문. 고르고 '다음'을 누르면 2번 문항 화면으로 넘어갑니다. */
export function FirstQuestion() {
  const answers = useQuizAnswers()

  return (
    <div className={`${styles.card} flex flex-col gap-5 pt-7 md:p-8 xl:w-(--size-quiz-card-width) xl:shrink-0`}>
      <QuizProgress step={1} />
      <QuizChoices question={firstQuestion} />
      <div className="pt-2">
        <QuizActions step={1} canProceed={Boolean(answers[firstQuestion.id])} onNext={() => goToStep(2)} />
      </div>
    </div>
  )
}
