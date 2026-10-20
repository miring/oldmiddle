import { FAQ_ITEMS } from './landingSteps'
import styles from './LandingSections.module.css'

/** 랜딩 "궁금한 점을 모았어요 · 시작하기 전에" (Figma "Questions before you begin") — 질문과 답이 모두 보이는 정적 목록 */
export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="flex flex-col gap-4 px-6 py-8 md:gap-8 md:px-12 md:pt-12 md:pb-16 xl:flex-row xl:gap-24 xl:px-24 xl:pt-20 xl:pb-24"
    >
      <div className="flex flex-col gap-4 xl:w-(--size-section-intro-width) xl:shrink-0">
        <p className={styles.label}>궁금한 점을 모았어요</p>
        <h2 id="faq-title" className={styles.title}>
          시작하기 전에
        </h2>
      </div>

      <ul role="list" className="flex flex-col pt-2 md:gap-7 md:pt-0 xl:min-w-0 xl:flex-1">
        {FAQ_ITEMS.map((item) => (
          // 모바일만 질문마다 위 구분선(두께는 Tailwind border-t, 색은 .faqItem)
          <li key={item.id} className={`${styles.faqItem} flex flex-col gap-4 border-t pt-4 pb-6 md:gap-3 md:border-t-0 md:pt-6 md:pb-0`}>
            <h3 className={styles.faqQuestion}>{item.question}</h3>
            <p className={styles.body}>{item.answer}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}
