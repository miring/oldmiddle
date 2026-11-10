import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { PREREGISTER_CONFIRM_LINK_COPY as C } from '../../config/copy'
import { DONE_HASH, PREREGISTER_HASH, goHome, navigate } from '../quiz/quizRoute'
import { RESULTS, type CompanionType } from '../quiz/results'
import { setDoneInfo } from './preregisterDone'
import { resetDraft } from './preregisterDraft'
import { REGIONS } from './preregisterOptions'
import { PreregisterError, confirmPreregistration } from './submitPreregistration'
import styles from './Under45Page.module.css'

type Status = 'checking' | 'notFound' | 'expired' | 'failed'

// 지역 코드 → 화면 이름 (시·군·구, 세종처럼 없으면 시·도)
function regionNameOf(code: string) {
  for (const province of REGIONS) {
    if (province.code === code) return province.name
    const district = province.districts.find((d) => d.code === code)
    if (district) return district.name
  }
  return ''
}

/** 확인 메일 속 링크 (#/confirm/<토큰>). 열자마자 확인하고, 끝나면 신청 완료 화면으로 바꿉니다 */
export function ConfirmPage({ token }: { token: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [status, setStatus] = useState<Status>('checking')

  useEffect(() => {
    let active = true
    // 개발 모드에서 두 번 실행돼도 서버가 같은 결과를 돌려줘 문제없음 (접수 완료 메일은 한 번만)
    confirmPreregistration(token)
      .then(({ regionCode, testType, sameRegionCount }) => {
        if (!active) return
        setDoneInfo({
          regionName: regionNameOf(regionCode),
          myType: testType && testType in RESULTS ? (testType as CompanionType) : null,
          sameRegionCount,
        })
        resetDraft()
        // 이 화면 기록을 완료 화면으로 바꿈 → 뒤로 가기로 다시 확인 요청을 보내지 않음
        navigate(DONE_HASH, { replace: true })
      })
      .catch((error) => {
        if (!active) return
        const code = error instanceof PreregisterError ? error.code : null
        setStatus(code === 'not_found' ? 'notFound' : code === 'expired' ? 'expired' : 'failed')
      })
    return () => {
      active = false
    }
  }, [token])

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [status])

  const title =
    status === 'notFound' ? C.notFoundTitle : status === 'expired' ? C.expiredTitle : status === 'failed' ? C.failedTitle : C.checking
  const body =
    status === 'notFound' ? C.notFoundBody : status === 'expired' ? C.expiredBody : status === 'failed' ? C.failedBody : null

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader onHomeClick={goHome} />
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-10 px-6 pt-10 pb-8">
        <div className="flex flex-1 flex-col items-center gap-4 text-center" aria-live="polite">
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {title}
          </h1>
          {body && <p className={styles.body}>{body}</p>}
        </div>

        {status !== 'checking' && (
          <div className="flex flex-col gap-3">
            {status !== 'failed' && <Button onClick={() => navigate(PREREGISTER_HASH)}>{C.again}</Button>}
            <Button variant="secondary" onClick={goHome}>
              {C.home}
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
