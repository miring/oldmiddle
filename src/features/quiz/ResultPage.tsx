import { useEffect, useRef } from 'react'
import mail from '../../assets/icons/mail.svg'
import rotateCcw from '../../assets/icons/rotate-ccw.svg'
import statusDot from '../../assets/landing/status-dot.svg'
import { BottomSheet } from '../../components/ui/BottomSheet/BottomSheet'
import { useBottomSheet } from '../../components/ui/BottomSheet/useBottomSheet'
import { Button } from '../../components/ui/Button/Button'
import { COPY } from '../../config/copy'
import { clearAnswers } from './quizAnswers'
import { QuizHeader } from './QuizParts'
import { PREREGISTER_HASH, goHomeWithNotice, navigate, quizHash } from './quizRoute'
import { RESULTS, type CompanionType } from './results'
import { ResultEmailSheet } from './ResultEmailSheet'
import styles from './ResultPage.module.css'

/** 테스트 결과 화면 (Figma "마지막사랑 · 결과 A~D") */
export function ResultPage({ type }: { type: CompanionType }) {
  const result = RESULTS[type]
  const match = RESULTS[result.match.type]
  const titleRef = useRef<HTMLHeadingElement>(null)
  const shareButtonRef = useRef<HTMLButtonElement>(null)
  const emailSheet = useBottomSheet({ onClose: () => shareButtonRef.current?.focus() })

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [type])

  const handleRetry = () => {
    clearAnswers()
    navigate(quizHash(1))
  }

  return (
    <div className="flex min-h-dvh flex-col">
      <QuizHeader />
      {/* 헤더가 화면 위에 고정되어 있어 그 높이만큼 내려서 시작합니다 */}
      <main className="flex flex-col pt-(--size-header-height)">
        {/* 나의 동행 유형 */}
        <section className={styles.hero}>
          <div className="mx-auto flex max-w-(--size-quiz-column-width) flex-col items-center gap-5 px-6 pt-7 pb-8">
            <div className="flex w-full items-center justify-between">
              <p className={styles.kicker}>나의 동행 유형 · {result.type}</p>
              <p className={styles.kickerMeta}>가입 없이 확인</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
                {result.name}
              </h1>
              <p className={`${styles.value} px-3.5 py-1.5`}>{result.value}</p>
            </div>
            <img className={styles.character} src={result.image} alt="" />
            <p className={styles.tagline}>{result.tagline}</p>
          </div>
        </section>

        {/* 결과 이야기 */}
        <section className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-col gap-6 px-6 py-8">
          <div className="flex flex-col gap-3">
            <h2 className={styles.sectionTitle}>당신은 이런 사람</h2>
            <p className={styles.reading}>{result.description}</p>
          </div>

          <div className={`${styles.matchCard} flex flex-col gap-4 p-5`}>
            <h2 className={styles.sectionTitle}>이런 분과 잘 맞아요</h2>
            <div className="flex items-center gap-3.5">
              <img className={styles.matchCharacter} src={match.image} alt="" />
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <p className={styles.matchLabel}>잘 맞는 인연</p>
                <p className={styles.matchName}>{match.name}</p>
              </div>
            </div>
            <p className={styles.reading}>{result.match.reason}</p>
          </div>

          <div className={`${styles.tipCard} flex flex-col gap-3 p-5`}>
            <h2 className={styles.sectionTitle}>첫 만남 팁</h2>
            <p className={styles.reading}>{result.tip}</p>
          </div>
        </section>

        {/* 선택하는 다음 만남 (사전 등록) */}
        <section className={styles.preregister}>
          <div className="mx-auto flex max-w-(--size-quiz-column-width) flex-col gap-4 px-6 py-7">
            <p className={`${styles.status} flex items-center gap-2`}>
              <img className={styles.statusDot} src={statusDot} alt="" />
              서비스 준비 중 · 사전 등록은 선택
            </p>
            <h2 className={styles.preregisterTitle}>{'나와 잘 맞는 유형의 분을\n가장 먼저 추천받으세요.'}</h2>
            <p className={styles.small}>
              결과는 가입 없이 모두 확인할 수 있어요. 원하시면 서비스 시작 소식을 받아보세요. 지금 바로 인연이 연결되는
              것은 아니에요.
            </p>
            <Button onClick={() => navigate(PREREGISTER_HASH)}>{COPY.preregisterStart}</Button>
            <p className={styles.reassurance}>{'가입이 아니라 사전 신청입니다.\n전화로 권유하지 않습니다.'}</p>
          </div>
        </section>

        {/* 공유와 다시 시작 */}
        <section className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-col gap-3 px-6 pt-7 pb-8">
          <Button ref={shareButtonRef} variant="soft" icon={mail} onClick={() => emailSheet.show()}>
            내 메일로 결과 받기
          </Button>
          <Button variant="secondary" icon={rotateCcw} onClick={handleRetry}>
            다시 테스트하기
          </Button>
          <p className={`${styles.disclaimer} pt-4`}>
            이 테스트는 재미로 즐기는 성향 테스트이며, 전문 심리검사를 대신하지 않습니다.
          </p>
        </section>
      </main>

      <BottomSheet open={emailSheet.open} onRequestClose={() => emailSheet.close()} title="내 메일로 결과 받기">
        <ResultEmailSheet
          result={result}
          onSent={() => emailSheet.close({ then: () => goHomeWithNotice('결과 메일을 보냈어요. 메일이 보이지 않으면 스팸함도 확인해 주세요.') })}
          onClose={() => emailSheet.close()}
        />
      </BottomSheet>
    </div>
  )
}
