import type { ReactNode } from 'react'
import { Brand } from '../Brand/Brand'
import styles from './SiteHeader.module.css'

type SiteHeaderProps = {
  /** 오른쪽에 둘 내용. 예: "준비 중" 상태, "마음 알아보기" */
  aside?: ReactNode
}

/** 로고가 있는 상단 바. 랜딩·문항 화면, 이후 앱 화면에서 함께 씁니다. */
export function SiteHeader({ aside }: SiteHeaderProps) {
  return (
    <header className={`${styles.header} flex items-center justify-between px-6 md:px-12 xl:px-24`}>
      <Brand />
      {aside}
    </header>
  )
}
