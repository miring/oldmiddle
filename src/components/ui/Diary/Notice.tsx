import type { ReactNode } from 'react'
import styles from './Notice.module.css'

type NoticeProps = {
  /** 앞에 둘 아이콘 (src/assets/icons). 글이 뜻을 전하므로 장식용 */
  icon: string
  /** calm: 옅은 초록 (안내) / warm: 옅은 노랑 (주의) */
  tone?: 'calm' | 'warm'
  children: ReactNode
}

/** 아이콘 + 한두 줄 안내 상자. 편지 도착 시각, 보낼 수 없는 내용 같은 안내에 씁니다 */
export function Notice({ icon, tone = 'calm', children }: NoticeProps) {
  return (
    <div className={`${styles.notice} ${styles[tone]} flex items-start gap-3 px-4 py-3.5`}>
      <img className={`${styles.icon} shrink-0`} src={icon} alt="" aria-hidden="true" />
      <p className={`${styles.text} min-w-0 flex-1`}>{children}</p>
    </div>
  )
}
