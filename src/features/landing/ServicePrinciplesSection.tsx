import { Callout } from '../../components/ui/Callout/Callout'
import { site } from '../../config/site'
import { subjectParticle } from '../../utils/korean'
import { SERVICE_PRINCIPLES } from './servicePrinciples'
import styles from './ServicePrinciplesSection.module.css'

/** 랜딩 "마지막사랑이 준비하는 만남" (Figma "Trust principles") — 어두운 배경 섹션 */
/** 서비스 소개 섹션 id (신청 완료 화면의 "…어떤 곳인가요?" 링크가 이 섹션으로 옴) */
export const SERVICE_INTRO_SECTION_ID = 'service-intro'

export function ServicePrinciplesSection() {
  return (
    <section
      id={SERVICE_INTRO_SECTION_ID}
      aria-labelledby="service-principles-title"
      className={`${styles.section} flex flex-col gap-4 content-gutter py-8 md:gap-8 md:py-16 xl:gap-10 xl:py-22`}
    >
      <div className="flex flex-col gap-4 md:gap-8 xl:flex-row xl:gap-24">
        <div className="flex flex-col gap-4 md:gap-5 xl:w-(--size-section-intro-width) xl:shrink-0">
          <p className={styles.label}>
            {site.serviceName}
            {subjectParticle(site.serviceName)} 준비하는 만남
          </p>
          <h2 id="service-principles-title" tabIndex={-1} className={styles.title}>
            가벼운 테스트 너머,
            <br />
            진중한 인연을 위해.
          </h2>
          <p className={styles.description}>테스트와는 별개로, 정식 서비스에서는 다음과 같은 만남을 준비하고 있어요.</p>
        </div>

        <ul className="xl:min-w-0 xl:flex-1">
          {SERVICE_PRINCIPLES.map((principle) => (
            // 모바일: 아이콘·제목 한 줄, 설명은 아래 전체 폭 / 태블릿 이상: 아이콘 왼쪽, 제목·설명 오른쪽
            <li
              key={principle.id}
              className={`${styles.item} grid items-center gap-x-3 gap-y-3 py-6 md:items-start md:gap-x-5 md:py-7`}
            >
              <img className={styles.icon} src={principle.icon} alt="" aria-hidden="true" />
              <div className="contents md:flex md:flex-col md:gap-3">
                <h3 className={styles.itemTitle}>{principle.title}</h3>
                <p className={`${styles.itemDescription} col-span-2 md:col-span-1`}>{principle.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Callout tone="inverse" layout="responsive" titleAs="h3" title="베타는 전액 무료로 준비해요">
        심사비를 포함해 별도 비용 없이 참여하실 수 있도록 계획하고 있어요.
      </Callout>
    </section>
  )
}
