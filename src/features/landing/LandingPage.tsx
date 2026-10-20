import { CompanionTypesSection } from './CompanionTypesSection'
import { HeroSection } from './HeroSection'
import { LandingHeader } from './LandingHeader'
import { ParticipationSection } from './ParticipationSection'
import { PreregistrationSection } from './PreregistrationSection'
import { ServicePrinciplesSection } from './ServicePrinciplesSection'

// 나머지 섹션은 확인 후 Figma 순서대로 추가합니다.
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
      </main>
    </>
  )
}
