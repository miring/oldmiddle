import type { ReactNode } from 'react'
import { Brand } from '../Brand/Brand'
import styles from './SiteHeader.module.css'

type SiteHeaderProps = {
  /** 오른쪽에 둘 내용. 예: "준비 중" 상태, "마음 알아보기" */
  aside?: ReactNode
  /** 화면 위에 고정. 쓰는 쪽에서 본문 위쪽에 헤더 높이(--size-header-height)만큼 여백을 둡니다 */
  fixed?: boolean
}

/** 로고가 있는 상단 바. 랜딩·문항 화면, 이후 앱 화면에서 함께 씁니다. */
export function SiteHeader({ aside, fixed = false }: SiteHeaderProps) {
  const position = fixed ? `${styles.fixed} fixed inset-x-0 top-0 z-(--z-header)` : ''

  return (
    <header className={`${styles.header} ${position} flex items-center justify-between px-6 md:px-12 xl:px-24`}>
      <Brand />
      {aside}
    </header>
  )
}
