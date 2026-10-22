import { useId, type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { FieldMessage } from '../FieldMessage/FieldMessage'
import styles from './TextField.module.css'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> & {
  label: string
  /** 라벨을 화면에서 숨기고 화면 읽기 프로그램에만 알림 (묶음 제목이 따로 있을 때) */
  hideLabel?: boolean
  value: string
  onChange: (value: string) => void
  /** 입력칸 아래 도움말 */
  hint?: ReactNode
  /** 오류 문구. 있으면 도움말 대신 보이고 입력칸이 오류 상태가 됨 */
  error?: string | null
  /** 입력칸 오른쪽에 붙일 요소 (예: "인증번호" 버튼) */
  trailing?: ReactNode
  inputRef?: Ref<HTMLInputElement>
}

/** 라벨 + 입력칸 + 도움말·오류 문구. 휴대폰 번호, 인증번호 등에서 씁니다. */
export function TextField({
  label,
  hideLabel = false,
  value,
  onChange,
  hint,
  error,
  trailing,
  inputRef,
  className,
  ...rest
}: TextFieldProps) {
  const id = useId()
  const messageId = `${id}-message`
  const message = error ?? hint

  return (
    <div className={`flex flex-col gap-2.5 ${className ?? ''}`}>
      <label htmlFor={id} className={hideLabel ? 'sr-only' : styles.label}>
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          ref={inputRef}
          className={`${styles.input} min-w-0 flex-1`}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={message ? messageId : undefined}
          {...rest}
        />
        {trailing}
      </div>
      <FieldMessage id={messageId} hint={hint} error={error} />
    </div>
  )
}
