import { SiteFooter } from '../../components/ui/SiteFooter/SiteFooter'
import { FOOTER_LINKS } from '../../config/copy'
import { withExampleBusiness, withExampleLinks } from '../../config/footerExamples'
import { site } from '../../config/site'
import { HomeAbout } from './HomeAbout'
import { HomeClosing } from './HomeClosing'
import { HomeFaq } from './HomeFaq'
import { HomeFlow } from './HomeFlow'
import { HomeHeader } from './HomeHeader'
import { HomeHero } from './HomeHero'
import { HomeLoveStyle } from './HomeLoveStyle'
import { HomePricing } from './HomePricing'
import { HomeSafety } from './HomeSafety'
import styles from './HomePage.module.css'

/** 개발 서버·외부 미리보기에서만 푸터 빈칸을 예시 값으로 채움. 운영 빌드에서는 false로 정해져 예시 값이 빌드에서 빠집니다 */
const SHOW_FOOTER_EXAMPLES = import.meta.env.DEV || import.meta.env.VITE_HOME_PREVIEW === 'true'

/** 정식 오픈 홈. 오픈 전(site.siteMode = 'prelaunch')에는 개발 서버의 #/home에서만 열립니다. */
export function HomePage() {
  return (
    <div className={styles.page}>
      <HomeHeader />
      {/* 헤더가 화면 위에 고정되어 있어 그 높이만큼 내려서 시작합니다 */}
      <main className="pt-(--size-header-height)">
        <HomeHero />
        <HomeAbout />
        <HomeFlow />
        <HomeLoveStyle />
        <HomeSafety />
        {site.showPricing && <HomePricing />}
        <HomeFaq />
        <HomeClosing />
      </main>
      <SiteFooter
        tone="dark"
        note={site.tagline}
        business={SHOW_FOOTER_EXAMPLES ? withExampleBusiness(site.business) : site.business}
        links={SHOW_FOOTER_EXAMPLES ? withExampleLinks(FOOTER_LINKS) : FOOTER_LINKS}
      />
    </div>
  )
}
