import type { ReactNode } from 'react'
import styles from './FieldMessage.module.css'

type FieldMessageProps = {
  /** 입력칸의 aria-describedby와 연결할 id */
  id: string
  /** 설명 문구 */
  hint?: ReactNode
  /** 오류 문구. 있으면 설명 대신 아이콘과 함께 보임 */
  error?: string | null
}

/** 입력칸 바로 아래 설명 또는 오류 문구 (신청 폼 전용 색). 오류는 아이콘 + 문구로, 색만으로 구분하지 않음 */
export function FieldMessage({ id, hint, error }: FieldMessageProps) {
  if (error) {
    return (
      <p id={id} className={`${styles.error} flex items-start gap-1.5`}>
        <span className={`${styles.icon} shrink-0`} aria-hidden="true" />
        <span>{error}</span>
      </p>
    )
  }
  if (!hint) return null
  return (
    <p id={id} className={styles.hint}>
      {hint}
    </p>
  )
}
