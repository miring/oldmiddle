import { CompanionTypesSection } from './CompanionTypesSection'
import { HeroSection } from './HeroSection'
import { LandingHeader } from './LandingHeader'

// 나머지 섹션은 확인 후 Figma 순서대로 추가합니다.
export function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
        <CompanionTypesSection />
      </main>
    </>
  )
}
