import { useEffect } from 'react'
import { takePendingLandingSection } from '../quiz/quizRoute'
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
  // 다른 화면에서 특정 섹션으로 보내 왔으면 그 섹션부터 (고정 헤더 높이는 scroll-padding-top이 비켜 줌)
  useEffect(() => {
    const sectionId = takePendingLandingSection()
    if (!sectionId) return
    const section = document.getElementById(sectionId)
    if (!section) return
    section.scrollIntoView({ block: 'start' })
    section.querySelector('h2')?.focus({ preventScroll: true })
  }, [])

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
