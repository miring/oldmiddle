import clock from '../../assets/icons/clock.svg'
import mail from '../../assets/icons/mail.svg'
import { Button, ButtonLink } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { respond } from '../../mocks/recommend'
import { KEPT_HASH, LETTER_HASH, MUTUAL_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { formatDay, partnerName } from './matchView'
import { RecommendationCard } from './RecommendationCard'
import { KEEP_MAX, mutualDeadline, nextMonthStart } from './recommendRules'
import { formatReveal, formatTimeLeft, useRecommendData } from './recommendView'
import styles from './Matching.module.css'
import own from './MyInfo.module.css'
import rec from './Recommend.module.css'

const c = MATCHING_COPY.today

/**
 * 오늘의 추천 (회원 첫 화면, Figma 없음). '인연이 오는 날'(화·금 저녁 8시)에 1명이 오고, 48시간 안에
 * 만나보고 싶어요 / 마음에 담기 / 다음에요 중 하나로 답합니다. 쌍방 매칭이 있으면 맨 위에 알립니다.
 */
export function TodayScreen() {
  const data = useRecommendData()
  const { now, info, state, recommendation, response, kept, mutual } = data
  const total = MATCHING_COPY.myInfo.plan.plans[info.plan.id].recommend
  const keepFull = kept.length >= KEEP_MAX

  return (
    <AppScreen title={c.title} tab="today" nav="today">
      <div className="flex flex-col gap-6 xl:mx-auto xl:max-w-(--size-app-card-width)">
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>

        {mutual && (
          <div className={`${rec.mutualBanner} flex flex-col gap-3 p-5`}>
            <p className={own.strong}>{c.mutual.banner}</p>
            <p className={own.note}>
              {partnerName(mutual.recommendation)} · {formatTimeLeft(mutualDeadline(mutual.matchedAt), now)}
            </p>
            <div className="xl:w-60">
              <ButtonLink href={MUTUAL_HASH}>{c.mutual.open}</ButtonLink>
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-x-6">
          <p className={own.note}>{c.monthLeft(info.plan.recommendLeft, total)}</p>
          <a href={KEPT_HASH} className={`${styles.textLink} flex items-center`}>
            {c.kept.link(kept.length, KEEP_MAX)} ›
          </a>
        </div>

        {state === 'open' && (
          <>
            <Notice icon={clock}>
              {c.deadline(formatReveal(data.deadline))} · {formatTimeLeft(data.deadline, now)}
            </Notice>
            <RecommendationCard recommendation={recommendation} mine={info} />
            <div className="flex flex-col gap-4">
              <ButtonLink href={LETTER_HASH}>{c.actions.letter}</ButtonLink>
              <div className="flex flex-col gap-1">
                <Button variant="outline" disabled={keepFull} onClick={() => respond(data.revealedAt, { kind: 'keep' })}>
                  {c.actions.keep}
                </Button>
                <p className={own.note}>{keepFull ? c.actions.keepFull(KEEP_MAX) : c.actions.keepNote}</p>
              </div>
              <div className="flex flex-col gap-1">
                <Button variant="secondary" onClick={() => respond(data.revealedAt, { kind: 'pass' })}>
                  {c.actions.pass}
                </Button>
                <p className={own.note}>{c.actions.passNote}</p>
              </div>
            </div>
          </>
        )}

        {state === 'responded' && response && (
          <section className={`${own.card} flex flex-col gap-4 p-5 xl:p-8`} aria-labelledby="today-result">
            <p className={own.label}>
              {partnerName(recommendation)} · {recommendation.partner.ageBand} · {recommendation.partner.district}
            </p>
            <h2 id="today-result" className={own.cardTitle}>
              {response.kind === 'letter' ? c.result.letterTitle : response.kind === 'keep' ? c.result.keepTitle : c.result.passTitle}
            </h2>
            <p className={own.value}>
              {response.kind === 'letter' ? c.result.letterBody : response.kind === 'keep' ? c.result.keepBody : c.result.passBody}
            </p>
            {response.kind === 'letter' && response.letter && (
              <div className={`${styles.questionBox} flex flex-col gap-1 px-5 py-4`}>
                <p className={styles.questionHeading}>{c.result.sentLetter}</p>
                <p className={own.value}>{response.letter}</p>
              </div>
            )}
          </section>
        )}

        {(state === 'round-ended' || state === 'month-used') && (
          <section className={`${own.card} flex flex-col gap-3 p-5 xl:p-8`} aria-labelledby="today-empty">
            <h2 id="today-empty" className={own.cardTitle}>
              {state === 'month-used' ? c.empty.monthUsed : c.empty.roundEnded}
            </h2>
            <p className={own.value}>
              {state === 'month-used' ? c.empty.monthUsedBody(formatDay(nextMonthStart(now))) : c.empty.roundEndedBody}
            </p>
          </section>
        )}

        {state !== 'open' && state !== 'month-used' && <Notice icon={mail}>{c.empty.next(formatReveal(data.next))}</Notice>}
      </div>
    </AppScreen>
  )
}
