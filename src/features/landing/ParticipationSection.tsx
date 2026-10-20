import { PARTICIPATION_STEPS } from './landingSteps'
import styles from './LandingSections.module.css'

/** 랜딩 "참여 방법" (Figma "Participation flow") */
export function ParticipationSection() {
  return (
    <section
      aria-labelledby="participation-title"
      className={`${styles.accentSurface} flex flex-col gap-5 content-gutter py-8 md:gap-10 md:py-16 xl:py-20`}
    >
      <div className="flex flex-col gap-5 md:gap-4">
        <p className={styles.label}>참여 방법</p>
        <h2 id="participation-title" className={styles.title}>
          내 마음을 알아보고, <br className="xl:hidden" />
          다음은 천천히.
        </h2>
      </div>

      {/* 모바일·태블릿: 세로 목록 / 데스크톱: 가로 3칸 */}
      {/* role="list": 목록 기호를 없앤 목록도 iOS VoiceOver가 목록으로 읽도록 */}
      <ol role="list" className="flex flex-col gap-7.5 pt-3 md:gap-8 md:pt-0 xl:flex-row xl:gap-12">
        {PARTICIPATION_STEPS.map((step, index) => (
          <li key={step.id} className="flex min-w-0 gap-4.5 md:gap-4 xl:flex-1">
            <span className={`${styles.stepBadge} flex shrink-0 items-center justify-center`} aria-hidden="true">
              {index + 1}
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-2 md:gap-3">
              <h3 className={styles.itemTitle}>{step.title}</h3>
              {/* 모바일에서는 제목 위, 태블릿 이상에서는 제목 아래 */}
              {step.optionalLabel && (
                <p className={`${styles.optional} order-first md:order-0`}>{step.optionalLabel}</p>
              )}
              <p className={styles.body}>{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
