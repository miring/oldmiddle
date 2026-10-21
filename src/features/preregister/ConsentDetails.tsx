import { CONSENT_COPY } from '../../config/copy'
import styles from './ConsentDetails.module.css'

/** 사전 신청 동의 항목의 [보기] 내용. id는 CONSENT_ITEMS의 id */
export function ConsentDetails({ id }: { id: string }) {
  if (id === 'age-and-notice') return <BulletList items={CONSENT_COPY.notice} />
  if (id === 'marketing') return <BulletList items={CONSENT_COPY.marketing} />
  if (id !== 'privacy') return null

  const { labels, rows, notes } = CONSENT_COPY.privacy
  return (
    <div className="flex flex-col gap-4">
      {/* 표 대신 항목별 카드: 좁은 화면에서도 한 줄씩 읽히게. 이름표(왜·언제까지)는 글 앞에 붙여 폭을 다 씀 */}
      <ul role="list" className="flex flex-col gap-3">
        {rows.map((row) => (
          <li key={row.what} className={`${styles.card} flex flex-col gap-1 p-3`}>
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
      <BulletList items={notes} />
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
