import { useEffect, useRef, useState } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button } from '../../components/ui/Button/Button'
import { site } from '../../config/site'
import { topicParticle } from '../../utils/korean'
import { PREREGISTER_HASH, RESULT_HASH, goBackTo, navigate } from '../quiz/quizRoute'
import { shareTestLink } from '../quiz/shareResult'
import { TestModeBanner } from './TestModeBanner'
import styles from './Under45Page.module.css'

/**
 * '45 미만'을 골랐을 때 안내 (Figma "사전신청 03 45세 미만" — 구조·문구만 참고).
 * 제출 전이라 저장하는 값은 없습니다.
 */
export function Under45Page() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [shareMessage, setShareMessage] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [])

  // 잘못 누른 경우: 폼으로 돌아감. 폼에서 연령대만 비우고 다른 입력값은 그대로 둠
  const handleReselectAge = () => goBackTo(PREREGISTER_HASH)

  const handleShare = async () => setShareMessage(await shareTestLink())

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-(--z-header)">
        <TestModeBanner />
        <BackHeader title="사전 신청" onBack={handleReselectAge} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-10 px-6 pt-10 pb-8">
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <span className={`${styles.icon} flex size-20 items-center justify-center`} aria-hidden="true">
            !
          </span>
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {site.serviceName}
            {topicParticle(site.serviceName)}
            <br />
            45세 이상을 위한 서비스예요
          </h1>
          <p className={styles.body}>
            관심 가져 주셔서 고마워요.
            <br />
            입력하신 정보는 저장하지 않았어요.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button onClick={() => navigate(RESULT_HASH)}>내 유형 결과로 돌아가기</Button>
          <Button variant="secondary" onClick={handleReselectAge}>
            연령대 다시 고르기
          </Button>
          <Button variant="secondary" onClick={handleShare}>
            테스트 링크 공유하기
          </Button>
          <p className={styles.shareMessage} aria-live="polite">
            {shareMessage}
          </p>
        </div>
      </main>
    </div>
  )
}
