import type { ReactNode } from 'react'
import coffee from '../../../assets/icons/coffee-dark.svg'
import door from '../../../assets/icons/door-white.svg'
import { PREREGISTER_BENEFITS } from '../../../config/copy'
import styles from './BenefitCard.module.css'

/**
 * 사전 신청 혜택 카드 (Figma "시연 · 이벤트 ① 결과 화면 · 혜택 배너"의 혜택 카드).
 * 배지 + 혜택 두 줄(커피 쿠폰 추첨 · 먼저 초대) + [이벤트 자세히 보기]. children에 버튼 등을 덧붙일 수 있습니다.
 */
export function BenefitCard({ eventHref, children }: { eventHref: string; children?: ReactNode }) {
  const rows = [
    { icon: coffee, circle: styles.circlePrimary, ...PREREGISTER_BENEFITS.coupon },
    { icon: door, circle: styles.circleSecondary, ...PREREGISTER_BENEFITS.invite },
  ]
  return (
    <div className={`${styles.card} flex flex-col gap-4 p-5`}>
      <p className={`${styles.badge} self-start px-3 py-1`}>{PREREGISTER_BENEFITS.badge}</p>
      <ul role="list" className="flex flex-col">
        {rows.map((row, index) => (
          <li key={row.title} className={`flex items-center gap-3 ${index > 0 ? `${styles.divided} mt-4 pt-4` : ''}`}>
            <span className={`${row.circle} flex size-11 shrink-0 items-center justify-center rounded-full`}>
              <img src={row.icon} alt="" aria-hidden="true" className="size-6" />
            </span>
            <div className="flex min-w-0 flex-col">
              <p className={styles.title}>{row.title}</p>
              <p className={styles.body}>{row.body}</p>
            </div>
          </li>
        ))}
      </ul>
      <a href={eventHref} className={`${styles.link} self-start`}>
        {PREREGISTER_BENEFITS.detail}
      </a>
      {children}
    </div>
  )
}
