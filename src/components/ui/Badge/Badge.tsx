import type { ReactNode } from 'react'
import styles from './Badge.module.css'

/** 알약 모양 노란 배지 (예: "45세 이상 전용"). 글자 길이만큼만 차지합니다. */
export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={`${styles.badge} self-start px-3 py-1 ${className ?? ''}`}>{children}</p>
}
