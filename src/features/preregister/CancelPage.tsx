import { useEffect, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button/Button'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { PREREGISTER_CANCEL_COPY as C } from '../../config/copy'
import { goHome } from '../quiz/quizRoute'
import { PreregisterError, cancelPreregistration } from './submitPreregistration'
import styles from './Under45Page.module.css'

type Status = 'ask' | 'canceling' | 'done' | 'notFound'

/** 사전 신청 취소 (#/cancel/<토큰>). 확인을 한 번 받은 뒤 서버에서 바로 삭제합니다. */
export function CancelPage({ token }: { token: string }) {
  const titleRef = useRef<HTMLHeadingElement>(null)
  const [status, setStatus] = useState<Status>('ask')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [status])

  const handleCancel = async () => {
    if (status === 'canceling') return
    setStatus('canceling')
    setError(null)
    try {
      await cancelPreregistration(token)
      setStatus('done')
    } catch (e) {
      if (e instanceof PreregisterError && e.code === 'not_found') setStatus('notFound')
      else {
        setError(C.failed)
        setStatus('ask')
      }
    }
  }

  const finished = status === 'done' || status === 'notFound'
  const title = status === 'done' ? C.doneTitle : status === 'notFound' ? C.notFoundTitle : C.title
  const body = status === 'done' ? C.doneBody : status === 'notFound' ? C.notFoundBody : C.body

  return (
    <div className="flex min-h-dvh flex-col">
      <SiteHeader onHomeClick={goHome} />
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-10 px-6 pt-10 pb-8">
        <div className="flex flex-1 flex-col items-center gap-4 text-center">
          <h1 ref={titleRef} tabIndex={-1} className={styles.title}>
            {title}
          </h1>
          <p className={styles.body}>{body}</p>
        </div>

        <div className="flex flex-col gap-3">
          {finished ? (
            <Button onClick={goHome}>{C.home}</Button>
          ) : (
            <>
              <Button onClick={handleCancel} disabled={status === 'canceling'}>
                {status === 'canceling' ? C.confirming : C.confirm}
              </Button>
              <Button variant="secondary" onClick={goHome}>
                {C.keep}
              </Button>
            </>
          )}
          <p className={styles.shareMessage} role="alert">
            {error}
          </p>
        </div>
      </main>
    </div>
  )
}
