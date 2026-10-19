import styles from './ChoiceCard.module.css'

type ChoiceCardProps = {
  label: string
  /** 장식용 그림. 의미는 label이 전달하므로 대체 텍스트는 비워 둡니다. */
  illustration: string
  selected?: boolean
  /** 그림을 천천히 흔드는 효과 (움직임 줄이기 설정에서는 꺼짐) */
  sway?: boolean
  onSelect: () => void
}

/** 그림 + 글자로 고르는 큰 선택 버튼. 테스트 문항, 프로필 선택 항목 등에서 씁니다. */
export function ChoiceCard({ label, illustration, selected = false, sway = false, onSelect }: ChoiceCardProps) {
  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      aria-pressed={selected}
      onClick={onSelect}
    >
      <img className={`${styles.illustration} ${sway ? styles.sway : ''}`} src={illustration} alt="" />
      <span className={styles.label}>{label}</span>
    </button>
  )
}
