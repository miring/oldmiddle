import type { ReactNode } from 'react'
import lock from '../../../assets/icons/lock.svg'
import styles from './LetterLocked.module.css'

type LetterLockedProps = {
  title: string
  body: string
  /** 아래에 둘 버튼 (예: 답장 쓰기) */
  children?: ReactNode
}

/** 아직 열리지 않은 편지 자리 (Figma Diary/LetterLocked). 두 사람이 모두 답해야 열립니다 */
export function LetterLocked({ title, body, children }: LetterLockedProps) {
  return (
    <div className={`${styles.box} flex flex-col items-center gap-2 px-6 py-5`}>
      <img className={styles.icon} src={lock} alt="" aria-hidden="true" />
      <p className={styles.title}>{title}</p>
      <p className={styles.body}>{body}</p>
      {children && <div className="mt-2 w-full">{children}</div>}
    </div>
  )
}
