import type { ReactNode } from 'react'
import door from '../../../assets/icons/door-white.svg'
import cup from '../../../assets/landing/event-cup.svg'
import { PREREGISTER_BENEFITS } from '../../../config/copy'
import styles from './BenefitCard.module.css'

/**
 * 사전 신청 혜택 카드. 혜택 두 개는 Figma "이벤트"(node 447:1218) 배너 모양
 * (혜택 01 진한 초록 + 커피 컵 / 혜택 02 연한 초록 + 문 아이콘). [이벤트 자세히 보기]와 children(버튼 등)이 뒤에 붙습니다.
 */
export function BenefitCard({ eventHref, children }: { eventHref: string; children?: ReactNode }) {
  const { coupon, invite } = PREREGISTER_BENEFITS
  return (
    <div className={`${styles.card} flex flex-col gap-4 p-5`}>
      <p className={`${styles.badge} self-start px-3 py-1`}>{PREREGISTER_BENEFITS.badge}</p>
      <ul role="list" className="flex flex-col gap-3">
        <li className={`${styles.coupon} relative flex items-center overflow-hidden py-4 pr-28 pl-5`}>
          <div className="flex min-w-0 flex-col gap-1">
            <p className={`${styles.label} self-start`}>{coupon.label}</p>
            <p className={styles.couponTitle}>{coupon.title}</p>
            <p className={styles.couponBody}>
              <strong className={styles.couponStrong}>사전 신청</strong>
              {coupon.body}
            </p>
          </div>
          <span aria-hidden="true" className={`${styles.glow} absolute`} />
          <img src={cup} alt="" aria-hidden="true" className={`${styles.cup} absolute`} />
        </li>
        <li className={`${styles.invite} flex items-end gap-3 px-5 py-4`}>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <p className={`${styles.label} self-start`}>{invite.label}</p>
            <p className={styles.inviteTitle}>{invite.title}</p>
            <p className={styles.inviteBody}>
              <strong>사전 신청</strong>
              {invite.body}
            </p>
          </div>
          <span className={`${styles.doorCircle} flex shrink-0 items-center justify-center rounded-full`}>
            <img src={door} alt="" aria-hidden="true" className="size-10" />
          </span>
        </li>
      </ul>
      <a href={eventHref} className={`${styles.link} self-start`}>
        {PREREGISTER_BENEFITS.detail}
      </a>
      {children}
    </div>
  )
}
