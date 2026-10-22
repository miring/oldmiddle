import { useEffect, useId, useRef, type KeyboardEvent, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './BottomSheet.module.css'

type BottomSheetProps = {
  open: boolean
  /** 바깥 영역·ESC로 닫을 때 (useBottomSheet의 close) */
  onRequestClose: () => void
  title: string
  children: ReactNode
}

/**
 * 화면 아래에서 올라오는 확인 창. role="dialog" + aria-modal, 열리면 제목에 포커스,
 * 뒤 화면은 스크롤·조작 잠금(inert), Tab은 창 안에서만 돎. 열림 상태는 useBottomSheet로 관리합니다.
 */
export function BottomSheet({ open, onRequestClose, title, children }: BottomSheetProps) {
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (!open) return
    const root = document.getElementById('root')
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    root?.setAttribute('inert', '')
    titleRef.current?.focus()
    return () => {
      document.body.style.overflow = overflow
      root?.removeAttribute('inert')
    }
  }, [open])

  if (!open) return null

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.stopPropagation()
      onRequestClose()
      return
    }
    if (event.key !== 'Tab' || !panelRef.current) return
    // 포커스가 창 밖으로 나가지 않게 처음 ↔ 끝을 이어 줌
    const focusables = [...panelRef.current.querySelectorAll<HTMLElement>('button:not(:disabled), a[href], input, [tabindex="0"]')]
    if (focusables.length === 0) return
    const first = focusables[0]
    const last = focusables[focusables.length - 1]
    if (event.shiftKey && (document.activeElement === first || document.activeElement === titleRef.current)) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <div className={`${styles.layer} fixed inset-0 flex items-end justify-center`} onKeyDown={handleKeyDown}>
      {/* 바깥 영역: 누르면 닫힘 (키보드 사용자는 ESC나 [고치기]) */}
      <div className={`${styles.scrim} absolute inset-0`} onClick={onRequestClose} aria-hidden="true" />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`${styles.panel} relative flex w-full max-w-(--size-quiz-column-width) flex-col gap-5 px-6 pt-7`}
      >
        <h2 id={titleId} ref={titleRef} tabIndex={-1} className={styles.title}>
          {title}
        </h2>
        {children}
      </div>
    </div>,
    document.body,
  )
}
