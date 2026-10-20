import type { ButtonHTMLAttributes } from 'react'
import arrowBack from '../../../assets/icons/arrow-back.svg'
import styles from './Button.module.css'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /**
   * primary: 주요 행동(화면마다 하나) / secondary: 이전·다시 하기 같은 보조 행동
   * soft: 공유처럼 눈에 띄되 주요 행동은 아닌 것
   */
  variant?: 'primary' | 'secondary' | 'soft'
  /** forward: 글자 뒤 → / back: 글자 앞 < */
  arrow?: 'forward' | 'back'
  /** 글자 앞에 둘 아이콘 이미지 주소 (장식용, 의미는 글자로 전달) */
  icon?: string
  /** lg: 글자를 왼쪽, 화살표를 오른쪽 끝에 두는 큰 버튼 (랜딩 초대 버튼) */
  size?: 'md' | 'lg'
}

/** 기본 버튼. 폭은 부모 너비를 꽉 채우므로, 폭은 감싸는 요소에서 정합니다. */
export function Button({
  variant = 'primary',
  arrow,
  icon,
  size = 'md',
  className,
  children,
  type = 'button',
  ...rest
}: ButtonProps) {
  const classes = [
    styles.button,
    styles[variant],
    size === 'lg' ? styles.lg : '',
    icon ? styles.withIcon : '',
    className ?? '',
  ].join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {arrow === 'back' && <img className={styles.backArrow} src={arrowBack} alt="" />}
      {icon && <img className={styles.icon} src={icon} alt="" />}
      {children}
      {arrow === 'forward' && <span className={styles.forwardArrow} aria-hidden="true" />}
    </button>
  )
}
