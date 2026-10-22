import { useId, type Ref } from 'react'
import styles from './SelectField.module.css'

export type SelectOption = { value: string; label: string }

type SelectFieldProps = {
  label: string
  /** 라벨을 화면에서 숨기고 화면 읽기 프로그램에만 알림 (묶음 제목이 따로 있을 때) */
  hideLabel?: boolean
  name: string
  value: string
  options: SelectOption[]
  /** 아무것도 고르지 않았을 때 보이는 문구 */
  placeholder: string
  onChange: (value: string) => void
  disabled?: boolean
  /** 오류 상태 (테두리·배경). 오류 문구는 묶음 아래에 따로 두고 describedBy로 연결 */
  invalid?: boolean
  describedBy?: string
  selectRef?: Ref<HTMLSelectElement>
}

/** 라벨 + 선택 상자(휴대폰 기본 선택 창 사용). 사는 지역(시·도, 시·군·구) 등에서 씁니다. */
export function SelectField({
  label,
  hideLabel = false,
  name,
  value,
  options,
  placeholder,
  onChange,
  disabled = false,
  invalid = false,
  describedBy,
  selectRef,
}: SelectFieldProps) {
  const id = useId()

  return (
    <div className="flex min-w-0 flex-col gap-2.5">
      <label htmlFor={id} className={hideLabel ? 'sr-only' : styles.label}>
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          ref={selectRef}
          name={name}
          className={`${styles.select} ${value ? '' : styles.empty} w-full`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* 화살표: 오른쪽 끝에서 띄워 그림 (브라우저마다 기본 화살표 위치가 달라서 직접 그림) */}
        <span className={`${styles.arrow} pointer-events-none absolute`} aria-hidden="true" />
      </div>
    </div>
  )
}
