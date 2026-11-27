import { useEffect, useRef } from 'react'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { Button } from '../../components/ui/Button/Button'
import { COPY } from '../../config/copy'
import { PREREGISTER_HASH, goBackTo, navigate } from '../quiz/quizRoute'

/**
 * 사전 신청 이벤트 자세히 보기 (#/event). 지금은 자리만 만들어 둔 화면입니다.
 * TODO: Figma "시연 · 이벤트 ③ 이벤트 자세히 보기"(대상·응모·경품·추첨일·발표·받는 방법·꼭 읽어 주세요)로 채우기
 */
export function EventPage() {
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    window.scrollTo(0, 0)
    titleRef.current?.focus()
  }, [])

  return (
    <div className="flex min-h-dvh flex-col">
      <div className="sticky top-0 z-(--z-header)">
        <BackHeader title="사전 신청 이벤트" onBack={() => goBackTo(`${window.location.pathname}${window.location.search}`)} />
      </div>
      <main className="mx-auto flex w-full max-w-(--size-quiz-column-width) flex-1 flex-col gap-6 px-6 pt-6 pb-12">
        <h1 ref={titleRef} tabIndex={-1} className="sr-only">
          사전 신청 이벤트
        </h1>
        {/* 이벤트 내용 자리 (Figma ③ 적용 예정) */}
        <section aria-label="이벤트 내용" className="flex-1" />
        <Button onClick={() => navigate(PREREGISTER_HASH)}>{COPY.preregisterStart}</Button>
      </main>
    </div>
  )
}
