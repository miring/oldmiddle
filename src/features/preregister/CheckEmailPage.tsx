import { useEffect, useRef, useState } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button } from '../../components/ui/Button/Button'
import { PREREGISTER_CHECK_EMAIL_COPY as C } from '../../config/copy'
import { PREREGISTER_HASH, goHome, navigate } from '../quiz/quizRoute'
import { getPendingEmail } from './preregisterDone'
import { TestModeBanner } from './TestModeBanner'
import styles from './Under45Page.module.css'

/** 신청 뒤 '메일함을 확인해 주세요'. 신청은 메일 속 링크(#/confirm/<토큰>)를 눌러야 끝납니다 */
export function CheckEmailPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)
  // 새로고침하면 주소를 모르므로 주소 줄만 숨김
  const [email] = useState(getPendingEmail)

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true })
    requestAnimationFrame(() => window.scrollTo(0, 0))
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-(--z-header)">
        <TestModeBanner />
        {/* 뒤로 가기 버튼 없음 (다시 제출되지 않게). 휴대폰 뒤로 가기는 결과 화면으로 */}
        <BackHeader title={C.header} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-10 px-6 pt-10 pb-8">
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {C.title}
          </h1>
          {email && <p className={`${styles.title} break-all`}>{email}</p>}
          <p className={styles.body}>{C.body}</p>
          <ul className="flex flex-col gap-2">
            {C.tips.map((tip) => (
              <li key={tip} className={styles.shareMessage}>
                {tip}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-3">
          {/* 입력값이 남아 있어 메일 주소만 고쳐 다시 신청하면 됨 */}
          <Button variant="secondary" onClick={() => navigate(PREREGISTER_HASH)}>
            {C.retry}
          </Button>
          <Button onClick={goHome}>{C.home}</Button>
        </div>
      </main>
    </div>
  )
}
