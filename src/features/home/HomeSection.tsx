import type { ReactNode } from 'react'
import styles from './HomeSection.module.css'

type HomeSectionProps = {
  /** 섹션 제목 id (aria-labelledby) */
  labelledBy: string
  /** 헤더 메뉴에서 이동할 때 쓰는 id */
  id?: string
  /** 배경. default: 기본 / raised: 흰색 / accent: 옅은 노랑 / inverse: 초록 */
  tone?: Tone
  /** 데스크톱(1360px 이상)에서만 다른 배경을 쓸 때 */
  toneXl?: Tone
  /** hero: 첫 화면처럼 위 여백이 좁은 섹션 */
  spacing?: 'default' | 'hero'
  children: ReactNode
}

type Tone = 'default' | 'raised' | 'accent' | 'inverse'

const TONE_XL: Record<Tone, string> = {
  default: styles.xlDefault,
  raised: styles.xlRaised,
  accent: styles.xlAccent,
  inverse: styles.xlInverse,
}

const SPACING = {
  default: 'py-8 md:py-16 xl:py-20',
  hero: 'pt-6 pb-8 md:pt-10 md:pb-16 xl:pt-18 xl:pb-20',
}

/** 정식 홈 섹션 공통 감싸개: 배경은 화면 끝까지, 내용은 최대 폭 안에서 가운데 정렬 */
export function HomeSection({ labelledBy, id, tone = 'default', toneXl, spacing = 'default', children }: HomeSectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={labelledBy}
      className={`${styles[tone]} ${toneXl ? TONE_XL[toneXl] : ''} content-gutter ${SPACING[spacing]}`}
    >
      {children}
    </section>
  )
}
