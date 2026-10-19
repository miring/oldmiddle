import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** 글자 뒤에 → 화살표를 붙입니다 */
  trailingArrow?: boolean
}

/** 주요 행동 버튼. 화면마다 하나만 둡니다. 폭은 부모 너비를 꽉 채웁니다. */
export function Button({ trailingArrow = false, className, children, type = 'button', ...rest }: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${className ?? ''}`} {...rest}>
      {children}
      {trailingArrow && <span className={styles.arrow} aria-hidden="true" />}
    </button>
  )
}
