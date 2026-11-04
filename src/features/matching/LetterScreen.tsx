import { useEffect, useId, useState, type FormEvent } from 'react'
import alert from '../../assets/icons/alert.svg'
import { Button } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { FieldMessage } from '../../components/ui/FieldMessage/FieldMessage'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { respond } from '../../mocks/recommend'
import { navigate } from '../quiz/quizRoute'
import { TAB_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { clampLetter, findBlockedContent, LETTER_MAX_LENGTH, letterLength } from './diaryRules'
import { partnerName } from './matchView'
import { useRecommendData } from './recommendView'
import styles from './Matching.module.css'
import own from './MyInfo.module.css'
import rec from './Recommend.module.css'

const c = MATCHING_COPY.today.letter

/**
 * 만나보고 싶어요 + 한 줄 편지 (기획서 7장). 50자까지, 쓰지 않아도 보낼 수 있고 예시 문장을 눌러 넣을 수 있습니다.
 * 연락처·돈 이야기 차단은 교환일기와 같은 규칙(diaryRules.ts findBlockedContent)을 씁니다.
 */
export function LetterScreen() {
  const { state, revealedAt, recommendation } = useRecommendData()
  const id = useId()
  const [letter, setLetter] = useState('')

  // 이번 회차에 이미 답했거나 기한이 지났으면 오늘의 추천으로
  useEffect(() => {
    if (state !== 'open') navigate(TAB_HASH.today, { replace: true })
  }, [state])

  const blocked = findBlockedContent(letter)
  const blockedMessage = blocked.length > 0 ? `${blocked.join('·')}로 보이는 내용이 있어요. 지우고 보내 주세요.` : null

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (blockedMessage) return
    respond(revealedAt, { kind: 'letter', letter: letter.trim() })
    navigate(TAB_HASH.today, { replace: true })
  }

  if (state !== 'open') return null

  return (
    <AppScreen title={c.title} back={TAB_HASH.today} nav="today">
      <form className="flex flex-col gap-5 xl:mx-auto xl:max-w-(--size-app-card-width)" onSubmit={submit} noValidate>
        <h1 className={`${styles.listTitle} sr-only xl:not-sr-only`}>{c.title}</h1>
        <p className={own.value}>{c.lead(partnerName(recommendation))}</p>

        <div className="flex flex-col gap-2">
          <label htmlFor={`${id}-letter`} className={styles.fieldLabel}>
            {c.label}
          </label>
          <div className={`${styles.answerBox} flex flex-col justify-between gap-2 px-4 py-3.5`}>
            <textarea
              id={`${id}-letter`}
              className={`${styles.answerInput} flex-1`}
              value={letter}
              placeholder={c.examples[0]}
              onChange={(event) => setLetter(clampLetter(event.target.value))}
              aria-invalid={blockedMessage ? true : undefined}
              aria-describedby={`${id}-count${blockedMessage ? ` ${id}-blocked` : ''}`}
            />
            <p id={`${id}-count`} className={styles.counter}>
              {letterLength(letter)} / {LETTER_MAX_LENGTH}
            </p>
          </div>
          {blockedMessage && <FieldMessage id={`${id}-blocked`} error={blockedMessage} />}
        </div>

        <div className="flex flex-col gap-2">
          <p className={own.label}>{c.examplesTitle}</p>
          <ul role="list" className="flex flex-col gap-2">
            {c.examples.map((example) => (
              <li key={example}>
                <button type="button" className={`${rec.example} w-full px-4 text-left`} aria-label={c.useExample(example)} onClick={() => setLetter(example)}>
                  {example}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <Notice icon={alert} tone="warm">
          {c.blockedNotice}
        </Notice>
        <div className="xl:w-60 xl:self-end">
          <Button type="submit" disabled={!!blockedMessage}>
            {c.submit}
          </Button>
        </div>
      </form>
    </AppScreen>
  )
}
