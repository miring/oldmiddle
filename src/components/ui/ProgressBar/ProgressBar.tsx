import styles from './ProgressBar.module.css'

type ProgressBarProps = {
  value: number
  max: number
  /** 화면 읽기 프로그램용 설명. 예: "질문 진행" */
  label: string
}

/** 단계 진행 막대. 테스트 문항, 가입 단계 등에서 씁니다. */
export function ProgressBar({ value, max, label }: ProgressBarProps) {
  const percent = max > 0 ? Math.min(100, (value / max) * 100) : 0

  return (
    <div
      className={styles.track}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
    >
      <div className={styles.fill} style={{ width: `${percent}%` }} />
    </div>
  )
}
