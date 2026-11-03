import styles from './ProgressDots.module.css'

type ProgressDotsProps = {
  /** 채울 점 수 */
  done: number
  total?: number
  /** sm: 매칭 카드 8px / md: 교환일기 진행 10px */
  size?: 'sm' | 'md'
}

/** 진행 점(●●○). 점은 그림으로 두고 화면 읽기 프로그램에는 "3번 중 2번"으로 알립니다 */
export function ProgressDots({ done, total = 3, size = 'sm' }: ProgressDotsProps) {
  return (
    <span role="img" aria-label={`${total}번 중 ${done}번`} className={`${styles[size]} flex shrink-0 items-center`}>
      {Array.from({ length: total }, (_, index) => (
        <span key={index} className={`${styles.dot} ${index < done ? styles.done : ''}`} />
      ))}
    </span>
  )
}
