import { useEffect, useRef, useState } from 'react'

/**
 * 바텀시트 열림 상태 + 휴대폰 '뒤로 가기'로 닫기.
 * 열 때 방문 기록을 한 칸 쌓고(주소는 그대로), 닫을 때는 그 기록을 되돌립니다.
 * 그래서 뒤로 가기·[고치기]·바깥·ESC 어느 쪽으로 닫아도 기록이 남지 않습니다.
 * (기록 쌓기는 여는 순간에 해서 개발 모드에서 effect가 두 번 실행돼도 꼬이지 않음)
 */
export function useBottomSheet({ onClose }: { onClose?: () => void } = {}) {
  const [open, setOpen] = useState(false)
  const onCloseRef = useRef(onClose)
  useEffect(() => {
    onCloseRef.current = onClose
  })

  // 닫힌 뒤에 onClose (뒤 화면 잠금(inert)이 풀린 다음이라 포커스를 옮길 수 있음)
  const wasOpen = useRef(false)
  useEffect(() => {
    if (wasOpen.current && !open) onCloseRef.current?.()
    wasOpen.current = open
  }, [open])

  // 닫은 다음 이어서 할 일 (예: 완료 화면으로 이동). 기록을 되돌린 뒤에 실행해야 기록이 꼬이지 않음
  const thenRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    if (!open) return
    const handlePopState = () => {
      setOpen(false)
      const then = thenRef.current
      thenRef.current = null
      then?.()
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [open])

  const show = () => {
    window.history.pushState({ ...(window.history.state ?? {}), sheet: true }, '')
    setOpen(true)
  }

  // 닫기: 쌓아 둔 기록을 되돌리면 위 popstate에서 닫힘. then은 닫힌 뒤 실행
  const close = (options?: { then?: () => void }) => {
    const then = typeof options?.then === 'function' ? options.then : null
    const state: unknown = window.history.state
    if (state && typeof state === 'object' && 'sheet' in state) {
      thenRef.current = then
      window.history.back()
    } else {
      setOpen(false)
      then?.()
    }
  }

  return { open, show, close }
}
