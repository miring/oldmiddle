import type { ButtonHTMLAttributes } from 'react'
import arrowBack from '../../../assets/icons/arrow-back.svg'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** primary: 주요 행동(화면마다 하나), secondary: 이전·취소 같은 보조 행동 */
  variant?: 'primary' | 'secondary'
  /** forward: 글자 뒤 → / back: 글자 앞 < */
  arrow?: 'forward' | 'back'
}

/** 기본 버튼. 폭은 부모 너비를 꽉 채우므로, 폭은 감싸는 요소에서 정합니다. */
export function Button({
  variant = 'primary',
  arrow,
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]} ${className ?? ''}`} {...rest}>
      {arrow === 'back' && <img className={styles.backArrow} src={arrowBack} alt="" />}
      {children}
      {arrow === 'forward' && <span className={styles.forwardArrow} aria-hidden="true" />}
    </button>
  )
}
