import calendar from '../../assets/icons/calendar.svg'
import clock from '../../assets/icons/clock.svg'
import mail from '../../assets/icons/mail.svg'
import { ButtonLink } from '../../components/ui/Button/Button'
import { LetterCard } from '../../components/ui/Diary/LetterCard'
import { LetterLocked } from '../../components/ui/Diary/LetterLocked'
import { Notice } from '../../components/ui/Diary/Notice'
import { ProgressDots } from '../../components/ui/Diary/ProgressDots'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { decideHash, MEMBER_HOME_HASH, writeHash } from './appRoute'
import { currentRound, daysLeft, DIARY_DAYS, DIARY_ROUNDS, entryOf, isListed, listedUntil, matchPhase, openRounds, roundState } from './diaryRules'
import { ReportLink } from './MatchesScreen'
import { formatDay, formatMeeting, letterHeading, ordinal, partnerName } from './matchView'
import type { Match } from './matchTypes'
import styles from './Matching.module.css'

/** 교환일기 상세: 진행 + 편지들 + 안내 (Figma 311:610 휴대폰 / 311:702 데스크톱 오른쪽) */
export function DiaryPanel({ match, now }: { match: Match; now: Date }) {
  const c = MATCHING_COPY
  const name = partnerName(match)
  const phase = matchPhase(match, now)
  const round = phase === 'diary' ? currentRound(match, now) : DIARY_ROUNDS
  const left = daysLeft(match, now)
  const opened = openRounds(match, now)
  // 진행 점: 교환일기 중에는 지금 편지 번호까지, 그 뒤에는 함께 열린 편지 수
  const dots = phase === 'diary' ? round : opened
  // 교환일기 중에는 지금 편지까지, 그 뒤에는 함께 열린 편지만
  const rounds = Array.from({ length: phase === 'diary' ? round : opened }, (_, index) => index + 1)

  const progressTitle = phase === 'diary' ? `${ordinal(round)} 편지 · ${DIARY_ROUNDS}번 중 ${round}번` : c.allShared
  const remaining = left > 0 ? `${DIARY_DAYS}일 중 ${left}일 남았어요` : '오늘이 마지막 날이에요'
  const inlineProgress = phase === 'diary' ? `${round} / ${DIARY_ROUNDS} · ${DIARY_DAYS}일 중 ${left}일 남음` : progressTitle

  // 마무리된 매칭: 편지 없이 안내와 [홈으로]만 (로고와 같은 회원 첫 화면으로). 목록에 남아 있는 동안은 사라지는 날도 알립니다
  if (phase === 'closed') {
    return (
      <div className={`${styles.panel} flex flex-col gap-5`}>
        <h2 className={`${styles.panelTitle} sr-only xl:not-sr-only`}>{name}과의 교환일기</h2>
        <Notice icon={mail}>
          {isListed(match, now) ? `${c.closedNotice}. ${c.closedRemoval(formatDay(listedUntil(match)))}` : c.closedNotice}
        </Notice>
        <div className="xl:w-60">
          <ButtonLink href={MEMBER_HOME_HASH}>{c.closedHome}</ButtonLink>
        </div>
        <ReportLink matchId={match.id} />
      </div>
    )
  }

  return (
    <div className={`${styles.panel} flex flex-col gap-4 xl:gap-5`}>
      {/* 데스크톱: 제목 줄 오른쪽에 진행 / 휴대폰: 제목은 상단 바, 진행은 아래 상자 */}
      <div className="hidden items-center gap-4 xl:flex">
        <h2 className={`${styles.panelTitle} min-w-0 flex-1`}>{name}과의 교환일기</h2>
        <p className={`${styles.progressInline} flex items-center gap-2.5`}>
          <span>{inlineProgress}</span>
          <ProgressDots done={dots} size="md" />
        </p>
      </div>
      <div className={`${styles.progressBox} flex items-center gap-3 px-5 py-4 xl:hidden`}>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <p className={styles.progressTitle}>{progressTitle}</p>
          {phase === 'diary' && <p className={styles.progressSub}>{remaining}</p>}
        </div>
        <ProgressDots done={dots} size="md" />
      </div>

      <div className="grid items-start gap-4 xl:grid-cols-2 xl:gap-5">
        {rounds.map((n) => (
          <Letter key={n} match={match} round={n} now={now} active={phase === 'diary' && n === round} />
        ))}
      </div>

      {phase === 'diary' && <Notice icon={clock}>{c.deliveryNotice}</Notice>}
      {phase === 'decide' &&
        (match.myDecision === 'yes' ? (
          <Notice icon={clock}>{`${c.status.decided} · ${c.decide.waiting}`}</Notice>
        ) : (
          <div className="xl:w-60 xl:self-end">
            <ButtonLink href={decideHash(match.id)}>{c.decide.action}</ButtonLink>
          </div>
        ))}
      {phase === 'meeting' && (
        <Notice icon={calendar}>
          {match.meeting ? `${formatMeeting(match.meeting.at)} · ${match.meeting.place}에서 만나요.` : c.pickTimeNotice}
        </Notice>
      )}
      {phase === 'met' && match.meeting && (
        <Notice icon={mail}>{`${formatDay(match.meeting.at)}에 처음 만났어요. ${c.metNotice}`}</Notice>
      )}
      <ReportLink matchId={match.id} />
    </div>
  )
}

/** 편지 한 통. 열린 편지는 두 사람의 답, 지금 편지는 내 답(있으면) + 잠긴 자리 */
function Letter({ match, round, now, active }: { match: Match; round: number; now: Date; active: boolean }) {
  const c = MATCHING_COPY.locked
  const name = partnerName(match)
  const mine = entryOf(match, round, 'me')
  const theirs = entryOf(match, round, 'partner')
  const question = match.questions[round - 1].text
  const heading = letterHeading(match, round, now)
  const state = roundState(match, round, now)

  if (state === 'open' && mine && theirs) {
    return (
      <LetterCard
        heading={heading}
        question={question}
        answers={[
          { who: '나', answer: mine.answer, extra: mine.extra },
          { who: name, answer: theirs.answer, extra: theirs.extra },
        ]}
      />
    )
  }
  if (!active) return null

  const write = (
    <ButtonLink href={writeHash(match.id)}>{MATCHING_COPY.write.action}</ButtonLink>
  )
  const locked = state === 'open' ? null : {
    arrived: <LetterLocked title={`${name}의 편지가 도착했어요`} body={c.arrivedBody}>{write}</LetterLocked>,
    'my-turn': <LetterLocked title={c.myTurnTitle} body={c.together}>{write}</LetterLocked>,
    waiting: <LetterLocked title={`${name}의 답을 기다리고 있어요`} body={c.together} />,
    opening: <LetterLocked title={c.openingTitle} body={c.openingBody} />,
  }[state]

  return (
    <div className="flex flex-col gap-4">
      <LetterCard heading={heading} question={question} answers={mine ? [{ who: '나', answer: mine.answer, extra: mine.extra }] : []} />
      {locked}
    </div>
  )
}
