import { FaqAccordion } from '../../components/ui/FaqAccordion/FaqAccordion'
import { SectionHeading } from '../../components/ui/SectionHeading/SectionHeading'
import { HOME_FAQ_COPY } from '../../config/copy'
import { HomeSection } from './HomeSection'

/**
 * 정식 홈 ⑦ "자주 묻는 질문" (Figma "FAQ")
 * 모든 화면 폭에서 1열. 데스크톱은 머리를 가운데 정렬하고 최대 폭 760px로 가운데에 둠
 */
export function HomeFaq() {
  return (
    <HomeSection id="home-faq" labelledBy="home-faq-title">
      <div className="mx-auto flex flex-col gap-3 md:gap-7 xl:max-w-(--size-home-faq-max-width) xl:text-center">
        <SectionHeading id="home-faq-title" label="자주 묻는 질문" title="궁금하신 것부터" />
        {/* 질문·답은 왼쪽 정렬 */}
        <div className="xl:text-left">
          <FaqAccordion items={HOME_FAQ_COPY} defaultOpenIds={[HOME_FAQ_COPY[0].id]} />
        </div>
      </div>
    </HomeSection>
  )
}
