import type { ReactNode } from 'react'
import styles from './Callout.module.css'

type CalloutProps = {
  title: string
  children: ReactNode
  /** default: 밝은 배경 위 / inverse: 어두운 배경 위 */
  tone?: 'default' | 'inverse'
  /** stacked: 제목 위·설명 아래 / responsive: 데스크톱에서만 제목 왼쪽·설명 오른쪽 */
  layout?: 'stacked' | 'responsive'
  /** 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h2' | 'h3' | 'h4' | 'p'
}

/** 테두리 박스 안에 제목과 짧은 설명을 강조해 보여 주는 안내 상자 (예: "베타는 전액 무료로 준비해요") */
export function Callout({ title, children, tone = 'default', layout = 'stacked', titleAs: Title = 'p' }: CalloutProps) {
  const row = layout === 'responsive' ? 'xl:flex-row xl:items-center xl:gap-12' : ''
  const titleWidth = layout === 'responsive' ? 'xl:w-(--size-callout-title-width) xl:shrink-0' : ''

  return (
    <div className={`${styles.callout} ${styles[tone]} flex flex-col ${row}`}>
      <Title className={`${styles.title} ${titleWidth}`}>{title}</Title>
      <div className={`${styles.description} min-w-0 xl:flex-1`}>{children}</div>
    </div>
  )
}
