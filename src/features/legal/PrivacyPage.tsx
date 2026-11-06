import { useEffect, useRef } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { CONSENT_COPY } from '../../config/copy'
import { PRIVACY_POLICY, type PrivacySection } from '../../config/privacyPolicy'
import { goBackTo } from '../quiz/quizRoute'
import styles from './PrivacyPage.module.css'

/**
 * 개인정보 처리방침 (#/privacy). 내용은 src/config/privacyPolicy.ts.
 * 목차 링크는 두지 않습니다 — 주소의 #을 화면 구분에 쓰고 있어 페이지 안 # 링크가 화면 이동과 겹칩니다.
 */
export function PrivacyPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const { labels } = CONSENT_COPY.privacy
  const sections: readonly PrivacySection[] = PRIVACY_POLICY.sections

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [])

  // 앱 안에서 왔으면 이전 화면으로, 주소로 바로 들어왔으면 첫 화면으로
  const handleBack = () => goBackTo(`${window.location.pathname}${window.location.search}`)

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-(--z-header)">
        <BackHeader title={PRIVACY_POLICY.title} onBack={handleBack} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-col gap-8 px-6 pt-4 pb-12">
        <div className="flex flex-col gap-2">
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {PRIVACY_POLICY.title}
          </h1>
          <p className={styles.meta}>시행일 {PRIVACY_POLICY.effectiveDate}</p>
          <p className={styles.text}>{PRIVACY_POLICY.intro}</p>
        </div>

        <section aria-labelledby="privacy-summary" className={`${styles.summary} flex flex-col gap-2 p-5`}>
          <h2 id="privacy-summary" className={styles.heading}>
            한눈에 보기
          </h2>
          <BulletList items={PRIVACY_POLICY.summary} />
        </section>

        {sections.map((section) => (
          <section key={section.id} aria-labelledby={`privacy-${section.id}`} className="flex flex-col gap-3">
            <h2 id={`privacy-${section.id}`} className={styles.heading}>
              {section.title}
            </h2>
            {section.paragraphs?.map((text) => (
              <p key={text} className={styles.text}>
                {text}
              </p>
            ))}
            {section.rows && (
              <ul role="list" className="flex flex-col gap-3">
                {section.rows.map((row) => (
                  <li key={row.what} className={`${styles.card} flex flex-col gap-1 p-4`}>
                    <p className={styles.what}>{row.what}</p>
                    <dl className="flex flex-col gap-1">
                      <div className={styles.text}>
                        <dt className={`${styles.term} mr-2 inline`}>{labels.why}</dt>
                        <dd className="inline">{row.why}</dd>
                      </div>
                      <div className={styles.text}>
                        <dt className={`${styles.term} mr-2 inline`}>{labels.until}</dt>
                        <dd className="inline">{row.until}</dd>
                      </div>
                    </dl>
                  </li>
                ))}
              </ul>
            )}
            {section.bullets && <BulletList items={section.bullets} />}
          </section>
        ))}
      </main>
    </div>
  )
}

function BulletList({ items }: { items: readonly string[] }) {
  return (
    <ul role="list" className="flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item} className={`${styles.bullet} ${styles.text}`}>
          {item}
        </li>
      ))}
    </ul>
  )
}
