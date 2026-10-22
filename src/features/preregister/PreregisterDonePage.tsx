import { useEffect, useRef, useState } from 'react'
import doneOpenDoor from '../../assets/preregister/done-open-door.webp'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button, ButtonLink } from '../../components/ui/Button/Button'
import { PREREGISTER_DONE_COPY as C } from '../../config/copy'
import { site } from '../../config/site'
import { RESULT_HASH } from '../quiz/quizRoute'
import { RESULTS } from '../quiz/results'
import { shareTestLink } from '../quiz/shareResult'
import { getDoneInfo } from './preregisterDone'
import { TestModeBanner } from './TestModeBanner'
import styles from './PreregisterDonePage.module.css'

/** 같은 지역 신청자가 이 수 이상이면 숫자를 보여 줌 (미만이면 '신청을 받고 있어요') */
export const SAME_REGION_COUNT_THRESHOLD = 10

/**
 * 사전 신청 완료 (Figma "사전신청 03 / 03-1" — 구조·문구만 참고).
 * 저장 요청을 다시 보내는 동작은 없습니다. 넘겨받은 값이 없으면(새로고침·주소로 바로 진입) 기본 문구만 보여 줍니다.
 */
export function PreregisterDonePage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [info] = useState(getDoneInfo)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [])

  const result = info?.myType ? RESULTS[info.myType] : null
  const match = result ? RESULTS[result.match.type] : null
  const count = info?.sameRegionCount ?? null

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-(--z-header)">
        <TestModeBanner />
        {/* 뒤로 가기 버튼 없음 (다시 제출되지 않게). 휴대폰 뒤로 가기는 결과 화면으로 */}
        <BackHeader title={C.header} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-10 px-6 pt-2 pb-8">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col items-center gap-4 pt-4 text-center">
            {/* 꾸밈 이미지: 400px로 저장해 200px로 보여 줌(레티나). width·height로 자리를 미리 잡아 아래 내용이 밀리지 않음 */}
            <img className={`${styles.doneImage} size-50`} src={doneOpenDoor} width={200} height={200} alt="" />
            <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
              {C.title}
            </h1>
          </div>

          {/* 같은 지역 안내 */}
          <section className={`${styles.card} flex flex-col gap-2 p-5`}>
            {info && (
              <h2 className={styles.cardTitle}>
                {count !== null && count >= SAME_REGION_COUNT_THRESHOLD
                  ? C.regionCount(info.regionName, count)
                  : C.regionOpen(info.regionName)}
              </h2>
            )}
            <p className={styles.helper}>{C.notify}</p>
          </section>

          {/* 사전 신청 혜택: 문구가 정해지기 전에는 카드 전체를 숨김 */}
          {C.benefit.title && (
            <section className={`${styles.benefit} flex flex-col items-start gap-2 p-5`}>
              <p className={`${styles.badge} px-3 py-1`}>{C.benefit.badge}</p>
              <h2 className={styles.cardTitle}>{C.benefit.title}</h2>
              <p className={styles.body}>{C.benefit.note}</p>
            </section>
          )}

          {/* 내 결과 요약 (유형을 모르면 숨김) */}
          {result && match && (
            <p className={`${styles.summary} flex flex-col`}>
              <span>{C.resultSummary(result.name, match.name)}</span>
              <a href={RESULT_HASH} className={`${styles.link} self-start`}>
                {C.resultLink}
              </a>
            </p>
          )}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {site.kakaoChannelUrl && (
            <div className="flex flex-col gap-2">
              <ButtonLink variant="secondary" href={site.kakaoChannelUrl} target="_blank" rel="noopener noreferrer">
                {C.channel}
              </ButtonLink>
              <p className={styles.note}>{C.channelNote}</p>
            </div>
          )}
          <Button variant="secondary" onClick={async () => setShareMessage(await shareTestLink())}>
            {C.share}
          </Button>
          <p className={styles.note} aria-live="polite">
            {shareMessage}
          </p>
          <p className={styles.note}>{C.cancelNote}</p>
        </div>
      </main>
    </div>
  )
}
