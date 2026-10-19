import { HeroSection } from './HeroSection'
import { LandingHeader } from './LandingHeader'

// 나머지 섹션은 히어로 확인 후 순서대로 추가합니다.
export function LandingPage() {
  return (
    <>
      <LandingHeader />
      <main>
        <HeroSection />
      </main>
    </>
  )
}
