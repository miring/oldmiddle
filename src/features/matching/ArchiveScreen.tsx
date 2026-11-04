import { MATCHING_COPY } from '../../config/matchingCopy'
import { matchHash, MATCHES_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { DIARY_ROUNDS, matchPhase } from './diaryRules'
import { ReportLink } from './MatchesScreen'
import { formatDay, partnerName, useMatchData } from './matchView'
import styles from './Matching.module.css'

/** 교환일기 보관함: 만난 뒤에도 편지를 다시 봅니다 (Figma 311:682, 데스크톱은 같은 모양을 가운데 정렬) */
export function ArchiveScreen() {
  const c = MATCHING_COPY.archive
  const { matches, now } = useMatchData()
  const archived = matches
    .filter((match) => matchPhase(match, now) === 'met' && match.meeting)
    .sort((a, b) => Date.parse(b.meeting!.at) - Date.parse(a.meeting!.at))

  return (
    <AppScreen title={MATCHING_COPY.archiveLink} back={MATCHES_HASH} nav="matches">
      <div className="flex flex-col gap-4 xl:mx-auto xl:max-w-(--size-app-card-width)">
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{MATCHING_COPY.archiveLink}</h1>
        <p className={styles.intro}>{archived.length > 0 ? c.intro : c.empty}</p>
        {archived.length > 0 && (
          <ul role="list" className="flex flex-col gap-4">
            {archived.map((match) => (
              <li key={match.id}>
                <a href={matchHash(match.id)} className={`${styles.archiveItem} flex items-center gap-4 px-5 py-4.5`}>
                  <span className={`${styles.archiveAvatar} flex shrink-0 items-center justify-center`} aria-hidden="true">
                    {match.partner.familyName}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={styles.archiveName}>{partnerName(match)}</span>
                    <span className={styles.archiveMeta}>{`편지 ${DIARY_ROUNDS}통 · ${formatDay(match.meeting!.at)} 첫 만남`}</span>
                  </span>
                  <span className={styles.chevron} aria-hidden="true">
                    ›
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
        <ReportLink />
      </div>
    </AppScreen>
  )
}
