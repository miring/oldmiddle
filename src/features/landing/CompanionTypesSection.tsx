import { CompanionTypeCard } from '../../components/ui/CompanionTypeCard/CompanionTypeCard'
import { COMPANION_TYPES } from '../../data/companionTypes'
import styles from './CompanionTypesSection.module.css'

/** 랜딩 "서로 다른 네 가지 마음" (Figma "Four ways of being together" / "Character previews") */
export function CompanionTypesSection() {
  return (
    <section
      aria-labelledby="companion-types-title"
      className="flex flex-col gap-4 px-6 py-8 md:gap-10 md:px-12 md:py-16 xl:px-24 xl:pt-0 xl:pb-20"
    >
      <div className="flex flex-col gap-4">
        <p className={styles.label}>서로 다른 네 가지 마음</p>
        <h2 id="companion-types-title" className={styles.title}>
          당신이 바라는 동행은
          <br />
          어떤 모습인가요?
        </h2>
        <p className={styles.description}>함께하는 방식은 달라도, 곁을 바라는 마음은 같으니까요.</p>
      </div>

      {/* 모바일: 1열, 카드마다 아래 구분선 / 태블릿 이상: 2열, 줄마다 위·아래 구분선 */}
      <ul
        className={`${styles.list} md:grid md:grid-cols-2 md:gap-x-(--space-type-grid-gap-x) md:gap-y-8 md:pt-8`}
      >
        {COMPANION_TYPES.map((info) => (
          <li
            key={info.type}
            className={`${styles.item} py-6 md:pt-0 md:pb-8 md:odd:-me-(--space-type-grid-gap-x) md:odd:pe-(--space-type-grid-gap-x)`}
          >
            <CompanionTypeCard name={info.name} summary={info.summary} image={info.image} />
          </li>
        ))}
      </ul>

      <div className="flex justify-center pt-6">
        {/* 테스트 페이지 연결 전 임시 링크 */}
        <a href="#" className={`${styles.cta} w-full max-w-(--size-cta-max-width)`}>
          3분 테스트 해보기
        </a>
      </div>
    </section>
  )
}
