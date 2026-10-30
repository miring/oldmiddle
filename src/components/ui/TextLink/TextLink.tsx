import type { AnchorHTMLAttributes } from 'react'
import styles from './TextLink.module.css'

/**
 * 밑줄 글자 링크 (예: "사전 신청하셨나요? 이어서 가입하기", 푸터의 이용약관).
 * 글자는 작아도 누르는 영역은 48px 높이를 확보합니다.
 */
export function TextLink({ className, children, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={`${styles.link} inline-flex items-center ${className ?? ''}`} {...rest}>
      {children}
    </a>
  )
}
