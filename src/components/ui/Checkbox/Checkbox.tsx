import { useEffect, useRef, type ReactNode } from 'react'
import styles from './Checkbox.module.css'

type CheckboxProps = {
  checked: boolean
  /** 일부만 체크된 상태 (예: 전체 동의에서 몇 개만 동의) */
  indeterminate?: boolean
  onChange: (checked: boolean) => void
  children: ReactNode
}

/** 체크박스 + 라벨. 라벨 글자를 눌러도 체크되고, 누르는 영역은 줄 전체(48px 이상)입니다. */
export function Checkbox({ checked, indeterminate = false, onChange, children }: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // indeterminate는 HTML 속성이 아니라 DOM 값으로만 지정할 수 있음
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate
  }, [indeterminate])

  return (
    <label className={`${styles.row} flex min-w-0 flex-1 items-center gap-3`}>
      <input
        ref={inputRef}
        className={`${styles.input} sr-only`}
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className={`${styles.box} flex shrink-0 items-center justify-center`} aria-hidden="true" />
      <span className={styles.label}>{children}</span>
    </label>
  )
}
