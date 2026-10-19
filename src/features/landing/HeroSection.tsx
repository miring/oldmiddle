import { FirstQuestion } from './FirstQuestion'
import styles from './HeroSection.module.css'

export function HeroSection() {
  return (
    <section
      aria-labelledby="hero-title"
      className="flex flex-col px-6 pt-7 pb-8 md:gap-10 md:p-12 xl:flex-row xl:items-center xl:gap-16 xl:px-24 xl:py-20"
    >
      <div className="flex flex-col md:gap-6 xl:min-w-0 xl:flex-1">
        <p className={styles.audience}>45세 이상 싱글을 위한</p>
        {/* 줄바꿈 위치가 화면 폭마다 달라 <br>을 폭별로 보이거나 숨깁니다 */}
        <h1 id="hero-title" className={styles.title}>
          인생 후반을 <br className="hidden xl:inline" />
          함께 보낼 사람,
          <br />
          당신은 어떤 타입과 <br className="md:hidden xl:inline" />
          잘 맞을까요?
        </h1>
        <p className={styles.lead}>나의 하루에서 찾는, 나다운 인연.</p>
      </div>
      <FirstQuestion />
    </section>
  )
}
