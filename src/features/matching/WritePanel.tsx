import { useEffect, useId, useState, type FormEvent } from 'react'
import alert from '../../assets/icons/alert.svg'
import mail from '../../assets/icons/mail.svg'
import { Button } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { FieldMessage } from '../../components/ui/FieldMessage/FieldMessage'
import { TextField } from '../../components/ui/TextField/TextField'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { saveDiaryEntry } from '../../mocks/matches'
import { navigate } from '../quiz/quizRoute'
import { matchHash } from './appRoute'
import { canWrite, clampLetter, currentRound, deliveryTime, findBlockedContent, LETTER_MAX_LENGTH, letterLength } from './diaryRules'
import { ReportLink } from './MatchesScreen'
import { formatDay, ordinal, partnerName } from './matchView'
import type { Match } from './matchTypes'
import styles from './Matching.module.css'

/** 편지 쓰기 (Figma 311:630 휴대폰 / 311:741 데스크톱 오른쪽). 답과 '한 줄 더'는 각각 50자까지 */
export function WritePanel({ match, now }: { match: Match; now: Date }) {
  const c = MATCHING_COPY.write
  const id = useId()
  const [answer, setAnswer] = useState('')
  const [extra, setExtra] = useState('')
  const [attachMessage, setAttachMessage] = useState('')
  const writable = canWrite(match, now)
  const round = currentRound(match, now)

  // 이미 답했거나 교환일기가 끝났으면 상세로
  useEffect(() => {
    if (!writable) navigate(matchHash(match.id), { replace: true })
  }, [writable, match.id])

  // 전화번호·카카오톡 ID·계좌번호·돈 이야기가 있으면 보내기를 막습니다 (화면 검사, 서버 검사는 diaryRules.ts TODO)
  const blocked = findBlockedContent(`${answer}\n${extra}`)
  const blockedMessage = blocked.length > 0 ? `${blocked.join('·')}로 보이는 내용이 있어요. 지우고 보내 주세요.` : null
  const canSend = answer.trim().length > 0 && !blockedMessage

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!canSend) return
    saveDiaryEntry(match.id, { round, answer: answer.trim(), extra: extra.trim() || undefined })
    navigate(matchHash(match.id), { replace: true })
  }

  if (!writable) return null

  return (
    <form className={`${styles.panel} flex flex-col gap-5`} onSubmit={handleSubmit} noValidate>
      <div className={`${styles.questionBox} flex flex-col gap-2 px-6 py-5 xl:px-7 xl:py-6`}>
        {/* 날짜는 지금 쓰면 상대에게 도착하는 날 */}
        <p className={styles.questionHeading}>{`${ordinal(round)} 편지 · ${formatDay(deliveryTime(now.toISOString()))}`}</p>
        <h2 className={styles.question}>{match.questions[round - 1].text}</h2>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor={`${id}-answer`} className={styles.fieldLabel}>
          {c.answerLabel}
        </label>
        <div className={`${styles.answerBox} flex flex-col justify-between gap-2 px-4 py-3.5`}>
          <textarea
            id={`${id}-answer`}
            className={`${styles.answerInput} flex-1`}
            value={answer}
            onChange={(event) => setAnswer(clampLetter(event.target.value))}
            aria-invalid={blockedMessage ? true : undefined}
            aria-describedby={`${id}-count${blockedMessage ? ` ${id}-blocked` : ''}`}
          />
          <p id={`${id}-count`} className={styles.counter}>
            {letterLength(answer)} / {LETTER_MAX_LENGTH}
          </p>
        </div>
        {blockedMessage && <FieldMessage id={`${id}-blocked`} error={blockedMessage} />}
      </div>

      <TextField
        label={c.extraLabel}
        value={extra}
        onChange={(value) => setExtra(clampLetter(value))}
        placeholder={c.extraPlaceholder}
        hint={`${letterLength(extra)} / ${LETTER_MAX_LENGTH}`}
      />

      {/* 사진·목소리는 아직 UI만. 누르면 준비 중 안내 */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          {[c.attachPhoto, c.attachVoice].map((label) => (
            <button key={label} type="button" className={`${styles.attachChip} px-3.5`} onClick={() => setAttachMessage(c.attachPreparing)}>
              {label}
            </button>
          ))}
        </div>
        <p role="status" className={styles.progressSub}>
          {attachMessage}
        </p>
      </div>

      <Notice icon={mail}>{`보낸 편지는 내일 아침 8시에 ${partnerName(match)}에게 도착해요.`}</Notice>
      <Notice icon={alert} tone="warm">
        {c.blockedNotice}
      </Notice>
      <div className="xl:w-60 xl:self-end">
        <Button type="submit" disabled={!canSend}>
          {c.submit}
        </Button>
      </div>
      <ReportLink matchId={match.id} />
    </form>
  )
}
