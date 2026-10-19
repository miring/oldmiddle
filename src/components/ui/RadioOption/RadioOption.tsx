import styles from './RadioOption.module.css'

type RadioOptionProps = {
  /** 같은 질문의 선택지끼리 같은 name을 씁니다 */
  name: string
  value: string
  label: string
  checked: boolean
  onChange: (value: string) => void
}

/**
 * 한 줄짜리 라디오 선택지. 테스트 문항, 프로필·설정 항목 등에서 씁니다.
 * 실제 radio 입력을 써서 키보드(방향키)와 화면 읽기 프로그램에서도 동작합니다.
 */
export function RadioOption({ name, value, label, checked, onChange }: RadioOptionProps) {
  return (
    <label className={styles.option}>
      <input
        className={`${styles.input} sr-only`}
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
      />
      <span className={styles.control} aria-hidden="true" />
      <span className={styles.label}>{label}</span>
    </label>
  )
}
