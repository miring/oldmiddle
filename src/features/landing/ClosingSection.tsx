import sprout from '../../assets/landing/closing-sprout.svg'
import { Button } from '../../components/ui/Button/Button'
import { startQuiz } from '../quiz/quizRoute'
import styles from './LandingSections.module.css'

/** 랜딩 마지막 "다음 계절로의 초대" (Figma "An invitation to begin" / "Closing invitation") */
export function ClosingSection() {
  return (
    <section aria-labelledby="closing-title" className={`${styles.accentSurface} px-6 md:px-12 xl:px-24`}>
      <div className="flex flex-col gap-5 py-10 md:gap-8 md:py-14 xl:flex-row xl:items-center xl:gap-20 xl:py-20">
        <div className="flex flex-col gap-5 xl:min-w-0 xl:flex-1">
          <img className="size-22" src={sprout} alt="" />
          <h2 id="closing-title" className={styles.title}>
            다음 계절을 함께할 사람,
            <br />내 마음부터 알아볼까요?
          </h2>
          <p className={styles.body}>10가지 질문으로 나와 잘 맞는 동행을 알아보세요.</p>
        </div>

        <div className="flex flex-col gap-5 md:gap-4 xl:w-90 xl:shrink-0">
          <Button size="lg" arrow="forward" onClick={startQuiz}>
            나의 인연 유형 알아보기
          </Button>
          <p className={`${styles.body} text-center`}>
            내 결과는 <strong className={styles.accentStrong}>가입 없이 확인</strong>해요
          </p>
        </div>
      </div>
    </section>
  )
}
