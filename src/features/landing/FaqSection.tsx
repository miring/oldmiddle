import { FaqAccordion } from '../../components/ui/FaqAccordion/FaqAccordion'
import { FAQ_ITEMS } from './landingSteps'
import styles from './LandingSections.module.css'

/** 랜딩 "궁금한 점을 모았어요 · 시작하기 전에" (Figma "Questions before you begin") — 질문을 누르면 답이 펼쳐지는 목록 (첫 질문은 펼친 채로 시작) */
export function FaqSection() {
  return (
    <section
      aria-labelledby="faq-title"
      className="flex flex-col gap-4 content-gutter py-8 md:gap-8 md:pt-12 md:pb-16 xl:flex-row xl:gap-24 xl:pt-20 xl:pb-24"
    >
      <div className="flex flex-col gap-4 xl:w-(--size-section-intro-width) xl:shrink-0">
        <p className={styles.label}>궁금한 점을 모았어요</p>
        <h2 id="faq-title" className={styles.title}>
          시작하기 전에
        </h2>
      </div>

      <div className="pt-2 md:pt-0 xl:min-w-0 xl:flex-1">
        <FaqAccordion items={FAQ_ITEMS} defaultOpenIds={[FAQ_ITEMS[0].id]} />
      </div>
    </section>
  )
}
