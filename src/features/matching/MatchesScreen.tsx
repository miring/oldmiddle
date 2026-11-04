import { useEffect } from 'react'
import { MatchCard } from '../../components/ui/Diary/MatchCard'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { navigate } from '../quiz/quizRoute'
import { ARCHIVE_HASH, decideHash, matchHash, MATCHES_HASH, reportHash } from './appRoute'
import { matchPhase, type MatchPhase } from './diaryRules'
import { DiaryPanel } from './DiaryPanel'
import { AppScreen } from './AppScreen'
import { cardStatus, partnerMeta, partnerName, useMatchData } from './matchView'
import type { Match } from './matchTypes'
import { WritePanel } from './WritePanel'
import styles from './Matching.module.css'

const SECTIONS: { phase: MatchPhase; label: string }[] = [
  { phase: 'diary', label: MATCHING_COPY.sections.diary },
  { phase: 'decide', label: MATCHING_COPY.sections.decide },
  { phase: 'meeting', label: MATCHING_COPY.sections.meeting },
]

type MatchesScreenProps = {
  /** 없으면 목록 화면 (데스크톱은 오른쪽에 첫 매칭을 엽니다) */
  matchId?: string
  mode: 'detail' | 'write'
}

/**
 * 나의 매칭: 휴대폰·태블릿은 목록 → 상세(또는 편지 쓰기) 화면 이동,
 * 데스크톱은 왼쪽 목록 + 오른쪽 상세(또는 편지 쓰기) 2단 (Figma 311:598 / 311:610 / 311:630 / 311:702 / 311:741)
 */
export function MatchesScreen({ matchId, mode }: MatchesScreenProps) {
  const { matches, now } = useMatchData()
  // 목록에는 진행 중인 매칭만. 만난 뒤는 보관함에서만, 마무리된 매칭은 어디에도 남기지 않습니다 (주소로 열면 안내만)
  const listed = matches.filter((match) => SECTIONS.some(({ phase }) => phase === matchPhase(match, now)))
  const opened = matchId
    ? matches.find((match) => match.id === matchId)
    : (listed.find((match) => matchPhase(match, now) === 'diary') ?? listed[0])

  // 없는 매칭 주소로 들어오면 목록으로
  useEffect(() => {
    if (matchId && !opened) navigate(MATCHES_HASH, { replace: true })
  }, [matchId, opened])

  const title = !opened || !matchId ? MATCHING_COPY.title : mode === 'write' ? MATCHING_COPY.write.title : `${partnerName(opened)}과의 교환일기`

  return (
    <AppScreen
      title={title}
      back={matchId ? (mode === 'write' ? matchHash(matchId) : MATCHES_HASH) : undefined}
      tab={matchId ? undefined : 'matches'}
      nav="matches"
    >
      <div className="flex flex-col gap-10 xl:flex-row xl:items-start">
        <div className={`${matchId ? 'hidden xl:flex' : 'flex'} flex-col gap-4 xl:w-(--size-app-list-width) xl:shrink-0`}>
          <MatchList matches={listed} now={now} selectedId={opened?.id} />
        </div>
        {opened && (
          <div className={`${matchId ? '' : 'hidden xl:block'} min-w-0 xl:flex-1`}>
            {mode === 'write' ? <WritePanel match={opened} now={now} /> : <DiaryPanel match={opened} now={now} />}
          </div>
        )}
      </div>
    </AppScreen>
  )
}

function MatchList({ matches, now, selectedId }: { matches: Match[]; now: Date; selectedId?: string }) {
  const c = MATCHING_COPY

  return (
    <>
      {/* 휴대폰은 상단 바가 제목을 보여 주므로 데스크톱에서만 화면에 보임 */}
      <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>
      {matches.length === 0 ? (
        // 매칭 0건: 문구만
        <p className={styles.intro}>{c.empty}</p>
      ) : (
        <ListBody matches={matches} now={now} selectedId={selectedId} />
      )}
    </>
  )
}

function ListBody({ matches, now, selectedId }: { matches: Match[]; now: Date; selectedId?: string }) {
  const c = MATCHING_COPY
  const hrefOf = (match: Match) => (matchPhase(match, now) === 'decide' ? decideHash(match.id) : matchHash(match.id))

  return (
    <>
      <p className={styles.intro}>{c.intro}</p>
      {SECTIONS.map(({ phase, label }) => {
        const group = matches.filter((match) => matchPhase(match, now) === phase)
        if (group.length === 0) return null
        return (
          <section key={phase} className="flex flex-col gap-4" aria-labelledby={`matches-${phase}`}>
            <h2 id={`matches-${phase}`} className={styles.sectionLabel}>
              {label}
            </h2>
            <ul role="list" className="flex flex-col gap-4">
              {group.map((match) => (
                <li key={match.id}>
                  <MatchCard
                    href={hrefOf(match)}
                    initial={match.partner.familyName}
                    name={partnerName(match)}
                    meta={partnerMeta(match)}
                    selected={match.id === selectedId}
                    {...cardStatus(match, now)}
                  />
                </li>
              ))}
            </ul>
          </section>
        )
      })}
      <div className="flex flex-wrap items-center justify-between gap-x-6">
        <a href={ARCHIVE_HASH} className={`${styles.textLink} flex items-center`}>
          {c.archiveLink} ›
        </a>
        <ReportLink />
      </div>
    </>
  )
}

/** 신고하기 (기획서 8장: 모든 화면에). 매칭을 알면 그 사람으로 미리 골라 둡니다 */
export function ReportLink({ matchId }: { matchId?: string }) {
  return (
    <a href={reportHash(matchId)} className={`${styles.reportLink} flex items-center self-start`}>
      {MATCHING_COPY.reportLink}
    </a>
  )
}
