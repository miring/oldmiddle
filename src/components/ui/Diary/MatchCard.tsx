import { ProgressDots } from './ProgressDots'
import styles from './MatchCard.module.css'

type MatchCardProps = {
  href: string
  /** 성 한 글자 (동그라미 안) */
  initial: string
  /** '김○○님' */
  name: string
  /** '50대 초반 · 마포구' */
  meta: string
  /** 지금 상태 한마디. warm: 내가 할 일이 있을 때 / calm: 기다리거나 정해진 것 */
  status: { label: string; tone: 'warm' | 'calm' }
  /** 진행 점과 옆 글 (예: 2점 + '2 / 3'). 마무리된 매칭은 없음 */
  progress?: { done: number; label: string }
  /** 데스크톱에서 오른쪽에 열려 있는 매칭 */
  selected?: boolean
}

/** 나의 매칭 목록의 한 사람. 카드 전체가 링크입니다 (Figma Diary/MatchCard) */
export function MatchCard({ href, initial, name, meta, status, progress, selected = false }: MatchCardProps) {
  return (
    <a href={href} className={`${styles.card} ${selected ? styles.selected : ''} flex items-center gap-4 p-5`} aria-current={selected ? 'true' : undefined}>
      <span className={`${styles.avatar} flex shrink-0 items-center justify-center`} aria-hidden="true">
        {initial}
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <span className={styles.name}>{name}</span>
        <span className={styles.meta}>{meta}</span>
        <span className="flex flex-wrap items-center gap-x-2 gap-y-1.5">
          <span className={`${styles.chip} ${styles[status.tone]} px-3 py-1`}>{status.label}</span>
          {progress && (
            <span className="flex items-center gap-1">
              <ProgressDots done={progress.done} />
              {/* '2 / 3' 같은 숫자는 점이 이미 "3번 중 2번"으로 알리므로 화면 읽기에서 뺍니다 */}
              <span className={styles.progress} aria-hidden={/^\d/.test(progress.label) || undefined}>
                {progress.label}
              </span>
            </span>
          )}
        </span>
      </span>
    </a>
  )
}
