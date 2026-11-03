import { useEffect } from 'react'
import check from '../../assets/icons/check.svg'
import clock from '../../assets/icons/clock.svg'
import lock from '../../assets/icons/lock.svg'
import { Button } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { saveDecision } from '../../mocks/matches'
import { navigate } from '../quiz/quizRoute'
import { matchHash, MATCHES_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { matchPhase } from './diaryRules'
import type { Decision } from './matchTypes'
import { ReportLink } from './MatchesScreen'
import { ordinal, partnerName, useMatchData } from './matchView'
import styles from './Matching.module.css'

/** 의향 확인: 세 번의 편지를 모두 나눈 뒤 만날지 정합니다 (Figma 311:659 휴대폰 / 311:796 데스크톱) */
export function DecideScreen({ matchId }: { matchId: string }) {
  const c = MATCHING_COPY.decide
  const { matches, now } = useMatchData()
  const match = matches.find((item) => item.id === matchId)
  const ready = !!match && matchPhase(match, now) === 'decide'

  // 의향 확인 단계가 아니면 상세(또는 목록)로
  useEffect(() => {
    if (!ready) navigate(match ? matchHash(match.id) : MATCHES_HASH, { replace: true })
  }, [ready, match])

  if (!match || !ready) return null
  const name = partnerName(match)

  // '이번엔 여기까지'는 상대에게 알리지 않고 조용히 마무리합니다
  const decide = (decision: Decision) => {
    saveDecision(match.id, decision)
    navigate(MATCHES_HASH, { replace: true })
  }

  return (
    <AppScreen title={`${name}과의 교환일기`} back={matchHash(match.id)} nav="matches">
      <div className={`${styles.decideCard} flex flex-col gap-5 xl:mx-auto xl:max-w-(--size-app-card-width)`}>
        <p className={`${styles.kicker} hidden xl:block`}>{name}과의 교환일기</p>
        <h1 className={styles.decideTitle}>
          세 번의 편지를 <br className="xl:hidden" />
          모두 나눴어요
        </h1>
        <p className={styles.decideBody}>{c.body}</p>
        <ul role="list" className={`${styles.summary} flex flex-col gap-3.5 p-5 xl:px-6`}>
          {match.questions.map((question, index) => (
            <li key={question.short} className="flex items-center gap-2.5">
              <img className={styles.summaryIcon} src={check} alt="" aria-hidden="true" />
              {`${ordinal(index + 1)} · ${question.short}`}
            </li>
          ))}
        </ul>
        {match.myDecision === 'yes' ? (
          // 내가 먼저 고르고 상대를 기다림: 목록 카드 배지와 같은 '마음 확인중'
          <div className="flex flex-col items-start gap-3">
            <p className={`${styles.statusPill} px-3 py-1`}>{MATCHING_COPY.status.decided}</p>
            <Notice icon={clock}>{c.waiting}</Notice>
          </div>
        ) : (
          <>
            <h2 className={styles.decideQuestion}>{name}을 만나 보고 싶으세요?</h2>
            <div className="flex flex-col gap-5 xl:flex-row xl:gap-3">
              <div className="xl:flex-1">
                <Button onClick={() => decide('yes')}>{c.yes}</Button>
              </div>
              <div className="xl:flex-1">
                <Button variant="outline" onClick={() => decide('no')}>
                  {c.no}
                </Button>
              </div>
            </div>
            <Notice icon={lock}>{c.notice}</Notice>
          </>
        )}
        <ReportLink matchId={match.id} />
      </div>
    </AppScreen>
  )
}
