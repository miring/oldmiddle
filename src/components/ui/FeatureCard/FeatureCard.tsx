import type { ReactNode } from 'react'
import styles from './FeatureCard.module.css'

type FeatureCardProps = {
  /** 아이콘 이미지 주소 (src/assets/icons). 제목이 뜻을 전하므로 장식용 */
  icon: string
  title: string
  children: ReactNode
  /** 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h3' | 'h4' | 'p'
}

/** 아이콘 + 제목 + 설명 카드 (정식 홈 "시연은 이런 곳이에요"). 높이는 감싸는 격자에서 맞춥니다. */
export function FeatureCard({ icon, title, children, titleAs: Title = 'h3' }: FeatureCardProps) {
  return (
    <div className={`${styles.card} flex h-full flex-col gap-3 p-6`}>
      <span className={`${styles.iconBox} flex items-center justify-center`}>
        <img className={styles.icon} src={icon} alt="" />
      </span>
      <Title className={styles.title}>{title}</Title>
      <p className={styles.body}>{children}</p>
    </div>
  )
}
