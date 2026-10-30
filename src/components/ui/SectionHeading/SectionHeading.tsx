import type { ReactNode } from 'react'
import styles from './SectionHeading.module.css'

type SectionHeadingProps = {
  /** 제목 위 작은 라벨 (예: "이용 흐름") */
  label: string
  title: ReactNode
  description?: ReactNode
  /** 제목 id. 섹션의 aria-labelledby에 연결합니다 */
  id?: string
  /** 라벨 색. primary: 진한 노랑 / secondary: 초록 */
  labelTone?: 'primary' | 'secondary'
  /** default: 밝은 배경 위 / inverse: 어두운 초록 배경 위 */
  tone?: 'default' | 'inverse'
  /** 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h2' | 'h3'
}

/** 섹션 머리: 라벨 + 제목 + 설명. 정식 홈의 각 섹션에서 씁니다. */
export function SectionHeading({
  label,
  title,
  description,
  id,
  labelTone = 'primary',
  tone = 'default',
  titleAs: Title = 'h2',
}: SectionHeadingProps) {
  return (
    <div className={`${tone === 'inverse' ? styles.inverse : ''} flex flex-col gap-4`}>
      <div className={`${styles.heading} flex flex-col`}>
        <p className={`${styles.label} ${styles[labelTone]}`}>{label}</p>
        {/* tabIndex -1: 헤더 메뉴로 이동했을 때 제목에 포커스를 줘 화면 읽기 프로그램이 읽도록 */}
        <Title id={id} tabIndex={-1} className={styles.title}>
          {title}
        </Title>
      </div>
      {description && <p className={styles.description}>{description}</p>}
    </div>
  )
}
