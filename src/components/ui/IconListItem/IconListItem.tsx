import type { ReactNode } from 'react'
import styles from './IconListItem.module.css'

type IconListItemProps = {
  /** 아이콘 이미지 주소 (src/assets/icons). 글이 뜻을 전하므로 장식용 */
  icon: string
  /** 굵은 제목. 없으면 설명 한 줄만 보입니다 */
  title?: string
  children: ReactNode
  /** md: 아이콘 28 + 제목 18·설명 18 (안심 장치) / sm: 아이콘 24 + 한 줄 16 (히어로 안심 한 줄) */
  size?: 'md' | 'sm'
  /** default: 밝은 배경 위 / inverse: 어두운 초록 배경 위 */
  tone?: 'default' | 'inverse'
}

/** 아이콘 + 글 목록 한 줄. 감싸는 쪽에서 <ul role="list">로 묶고 이 컴포넌트를 <li> 안에 둡니다. */
export function IconListItem({ icon, title, children, size = 'md', tone = 'default' }: IconListItemProps) {
  return (
    // 아이콘과 글 사이: md 14px / sm 8px
    <div className={`${styles[size]} ${tone === 'inverse' ? styles.inverse : ''} flex items-start ${size === 'sm' ? 'gap-2' : 'gap-3.5'}`}>
      <img className={`${styles.icon} shrink-0`} src={icon} alt="" />
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        {title && <p className={styles.title}>{title}</p>}
        <p className={styles.body}>{children}</p>
      </div>
    </div>
  )
}
