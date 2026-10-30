import styles from './LoveTypeChip.module.css'

type LoveTypeChipProps = {
  name: string
  description: string
}

/** 사랑하는 방식 유형 하나를 보여 주는 칩 (정식 홈 "나는 어떻게 사랑하는 사람일까요?"). 누를 수 없는 정적 표시 */
export function LoveTypeChip({ name, description }: LoveTypeChipProps) {
  return (
    <div className={`${styles.chip} flex h-full flex-col px-4.5 py-3.5`}>
      <p className={styles.name}>{name}</p>
      <p className={styles.description}>{description}</p>
    </div>
  )
}
