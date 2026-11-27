import { useEffect, useState } from 'react'
import { takePendingLandingNotice, takePendingLandingSection } from '../quiz/quizRoute'
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
  // 다른 화면에서 넘겨 준 안내 (예: 결과 메일 보냄). 8초 뒤 또는 누르면 사라짐
  const [notice, setNotice] = useState(takePendingLandingNotice)
  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 8000)
    return () => window.clearTimeout(timer)
  }, [notice])

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
      <div role="status" className="fixed inset-x-0 top-(--size-header-height) pointer-events-none z-(--z-header) flex justify-center px-6 pt-3">
        {notice && (
          <button
            type="button"
            onClick={() => setNotice(null)}
            className="pointer-events-auto w-full max-w-(--size-quiz-column-width) rounded-(--radius-lg) bg-(--color-secondary) px-5 py-4 text-left text-(length:--type-body-size) leading-(--type-body-line) text-(--color-text-inverse-primary) shadow-(--shadow-card-feature)"
          >
            {notice}
          </button>
        )}
      </div>
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
