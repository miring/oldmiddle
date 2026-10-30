import type { ReactNode } from 'react'
import styles from './StepList.module.css'

export type Step = {
  id: string
  title: string
  description: string
  /** 초록으로 강조 (모바일·태블릿 타임라인에서만) */
  highlight?: boolean
  /** 설명 아래에 덧붙일 내용 (예: 교환일기 미리보기). 세로 타임라인(휴대폰·태블릿)에서만 보입니다 */
  detail?: ReactNode
}

type StepListProps = {
  steps: Step[]
  /** 단계 제목 수준. 놓이는 화면의 제목 구조에 맞춰 고릅니다 */
  titleAs?: 'h3' | 'h4'
  /** 강조 단계(highlight)에 옅은 초록 바탕을 깔지. 모든 화면 폭에 같게 적용 */
  highlightSurface?: boolean
}

/**
 * 순서 있는 단계 목록 (정식 홈 "이용 흐름").
 * 모바일·태블릿: 숫자 원을 선으로 잇는 세로 타임라인 / 데스크톱: 왼쪽 선이 있는 가로 칸
 */
export function StepList({ steps, titleAs: Title = 'h3', highlightSurface = false }: StepListProps) {
  return (
    // role="list": 목록 기호를 없앤 목록도 iOS VoiceOver가 목록으로 읽도록
    <ol role="list" className="flex flex-col xl:flex-row xl:gap-4">
      {steps.map((step, index) => {
        // 바탕을 깔 때는 좌우로 조금 넓혀 글자 위치는 다른 단계와 맞춤
        const surface = step.highlight && highlightSurface ? `${styles.surface} -mx-3 px-3 pt-3 xl:mx-0` : ''
        return (
          <li
            key={step.id}
            className={`${styles.step} ${step.highlight ? styles.highlight : ''} ${surface} flex gap-4 pb-5 last:pb-0 xl:min-w-0 xl:flex-1 xl:flex-col xl:gap-3 xl:py-3 xl:pr-4 xl:pl-6`}
          >
            <div className="flex w-10 shrink-0 flex-col items-center gap-1.5 xl:w-auto xl:items-start">
              <span className={`${styles.marker} flex items-center justify-center`} aria-hidden="true">
                {index + 1}
              </span>
              {index < steps.length - 1 && <span className={`${styles.line} flex-1 xl:hidden`} />}
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5 pt-1.5 xl:gap-2 xl:pt-0">
              <Title className={styles.title}>{step.title}</Title>
              <p className={styles.body}>{step.description}</p>
              {step.detail && <div className="pt-2.5 xl:hidden">{step.detail}</div>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
