import { PriceCard } from '../../components/ui/PriceCard/PriceCard'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { HOME_PRICING_COPY } from '../../config/copy'
import { HomeSection } from './HomeSection'
import styles from './HomePricing.module.css'

/**
 * 정식 홈 ⑥ "요금" (Figma "Pricing"). 보일지는 site.showPricing, 금액은 copy.ts HOME_PRICING_COPY
 * 카드 3개(큐레이션 보류): 휴대폰 1열 / 태블릿·데스크톱 3열. 같은 줄의 카드는 높이를 맞춤
 */
export function HomePricing() {
  return (
    <HomeSection id="home-pricing" labelledBy="home-pricing-title" toneXl="raised">
      <div className="flex flex-col gap-3.5 md:gap-8">
        <SectionHeading id="home-pricing-title" label="요금" title="가입 전에 먼저 보여 드려요" />
        <ul role="list" className="grid gap-3.5 md:grid-cols-3 md:gap-5">
          {HOME_PRICING_COPY.plans.map((plan) => (
            <li key={plan.name}>
              <PriceCard name={plan.name} price={plan.price} detail={plan.detail} />
            </li>
          ))}
        </ul>
        <p className={styles.note}>{HOME_PRICING_COPY.note}</p>
      </div>
    </HomeSection>
  )
}
