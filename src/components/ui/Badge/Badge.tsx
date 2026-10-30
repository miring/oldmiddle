import type { ReactNode } from 'react'
import styles from './Badge.module.css'

type BadgeProps = {
  children: ReactNode
  /** primary: 노란 바탕 (랜딩) / secondary: 옅은 초록 바탕 (정식 홈 "45세 이상 · 서울부터") */
  tone?: 'primary' | 'secondary'
  className?: string
}

/** 알약 모양 배지 (예: "45세 이상 전용"). 글자 길이만큼만 차지합니다. */
export function Badge({ children, tone = 'primary', className }: BadgeProps) {
  return <p className={`${styles.badge} ${styles[tone]} self-start px-3 py-1 ${className ?? ''}`}>{children}</p>
}
