import { useState, type FormEvent } from 'react'
import check from '../../assets/icons/check.svg'
import lock from '../../assets/icons/lock.svg'
import { Button } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { RadioOption } from '../../components/ui/RadioOption/RadioOption'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { matchHash, MATCHES_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { partnerName, useMatchData } from './matchView'
import styles from './Matching.module.css'

/**
 * 신고 사유 고르기 (목업, 기획서 8장 '신고 버튼은 모든 화면에'). 보내기는 실제로 저장하지 않습니다.
 * TODO(저장 로직): reports 테이블 저장 + 운영자 알림 (24시간 안에 직접 응답)
 */
export function ReportScreen({ matchId }: { matchId?: string }) {
  const c = MATCHING_COPY.report
  const { matches } = useMatchData()
  const [who, setWho] = useState(matchId ?? '')
  const [reason, setReason] = useState('')
  const [sent, setSent] = useState(false)
  const target = matches.find((match) => match.id === who)

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (who && reason) setSent(true)
  }

  return (
    <AppScreen title={c.title} back={matchId ? matchHash(matchId) : MATCHES_HASH} nav="matches">
      <form className="flex flex-col gap-6 xl:mx-auto xl:max-w-(--size-app-card-width)" onSubmit={handleSubmit}>
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>
        {sent ? (
          <Notice icon={check}>{`${c.done} ${c.preview}`}</Notice>
        ) : (
          <>
            {matchId && target ? (
              <p className={styles.fieldLabel}>{partnerName(target)}</p>
            ) : (
              <fieldset className="flex flex-col gap-3">
                <legend className={`${styles.fieldLabel} mb-3`}>{c.whoLabel}</legend>
                {matches.map((match) => (
                  <RadioOption key={match.id} name="report-who" value={match.id} label={partnerName(match)} checked={who === match.id} onChange={setWho} />
                ))}
              </fieldset>
            )}
            <fieldset className="flex flex-col gap-3">
              <legend className={`${styles.fieldLabel} mb-3`}>{c.reasonLabel}</legend>
              {c.reasons.map((item) => (
                <RadioOption key={item} name="report-reason" value={item} label={item} checked={reason === item} onChange={setReason} />
              ))}
            </fieldset>
            <Notice icon={lock}>{c.notice}</Notice>
            <Button type="submit" disabled={!who || !reason}>
              {c.submit}
            </Button>
          </>
        )}
      </form>
    </AppScreen>
  )
}
