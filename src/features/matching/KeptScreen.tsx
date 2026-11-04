import { Button } from '../../components/ui/Button/Button'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { removeKept } from '../../mocks/recommend'
import { TAB_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { formatDay, partnerName } from './matchView'
import { KEEP_MAX, keepUntil } from './recommendRules'
import { useRecommendData } from './recommendView'
import styles from './Matching.module.css'

const c = MATCHING_COPY.today.kept

/** 마음에 담은 분 (본인만 봄, 최대 5명). 빼도 상대에게 알리지 않습니다 */
export function KeptScreen() {
  const { kept } = useRecommendData()

  return (
    <AppScreen title={c.title} back={TAB_HASH.today} nav="today">
      <div className="flex flex-col gap-4 xl:mx-auto xl:max-w-(--size-app-card-width)">
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>
        <p className={styles.intro}>{c.intro(KEEP_MAX)}</p>
        <p className={styles.sectionLabel}>{c.link(kept.length, KEEP_MAX)}</p>
        {kept.length === 0 ? (
          <p className={styles.intro}>{c.empty}</p>
        ) : (
          <ul role="list" className="flex flex-col gap-4">
            {kept.map(({ recommendation: r, keptAt }) => (
              <li key={r.id} className={`${styles.archiveItem} flex items-center gap-4 px-5 py-4.5`}>
                <span className={`${styles.archiveAvatar} flex shrink-0 items-center justify-center`} aria-hidden="true">
                  {r.partner.familyName}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <span className={styles.archiveName}>{partnerName(r)}</span>
                  <span className={styles.archiveMeta}>
                    {r.partner.ageBand} · {r.partner.district}
                  </span>
                  <span className={styles.archiveMeta}>{c.until(formatDay(keepUntil(keptAt)))}</span>
                </span>
                <Button variant="outline" size="compact" aria-label={c.removeLabel(partnerName(r))} onClick={() => removeKept(r.id)}>
                  {c.remove}
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </AppScreen>
  )
}
