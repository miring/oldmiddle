import styles from './ChoiceChipGroup.module.css'

export type ChoiceChipOption = { value: string; label: string }

type ChoiceChipGroupProps = {
  /** 묶음 제목 (화면에 보이고, 화면 읽기 프로그램도 읽음) */
  legend: string
  /** 같은 묶음의 radio끼리 같은 name */
  name: string
  options: ChoiceChipOption[]
  value: string | null
  onChange: (value: string) => void
  /** 한 줄에 놓을 칩 개수 */
  columns?: 2 | 3
}

/**
 * 칩 모양 단일 선택 묶음. 실제 radio 입력이라 키보드(방향키)·화면 읽기 프로그램에서도 동작합니다.
 * 사전 신청 성별·연령대, 이후 프로필 선택 항목 등에서 씁니다.
 */
export function ChoiceChipGroup({ legend, name, options, value, onChange, columns = 2 }: ChoiceChipGroupProps) {
  return (
    <fieldset className="flex flex-col gap-2.5">
      <legend className={`${styles.legend} mb-2.5`}>{legend}</legend>
      <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {options.map((option) => {
          const checked = value === option.value
          return (
            <label key={option.value} className={`${styles.chip} ${checked ? styles.selected : ''} flex items-center justify-center`}>
              <input
                className={`${styles.input} sr-only`}
                type="radio"
                name={name}
                value={option.value}
                checked={checked}
                onChange={() => onChange(option.value)}
              />
              {option.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
