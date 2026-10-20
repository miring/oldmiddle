import { ClosingSection } from './ClosingSection'
import { CompanionTypesSection } from './CompanionTypesSection'
import { FaqSection } from './FaqSection'
import { HeroSection } from './HeroSection'
import { LandingFooter } from './LandingFooter'
import { LandingHeader } from './LandingHeader'
import { ParticipationSection } from './ParticipationSection'
import { PreregistrationSection } from './PreregistrationSection'
import { ServicePrinciplesSection } from './ServicePrinciplesSection'

export function LandingPage() {
  return (
    <>
      <LandingHeader />
      {/* 헤더가 화면 위에 고정되어 있어 그 높이만큼 내려서 시작합니다 */}
      <main className="pt-(--size-header-height)">
        <HeroSection />
        <CompanionTypesSection />
        <ServicePrinciplesSection />
        <ParticipationSection />
        <PreregistrationSection />
        <FaqSection />
        <ClosingSection />
      </main>
      <LandingFooter />
    </>
  )
}
