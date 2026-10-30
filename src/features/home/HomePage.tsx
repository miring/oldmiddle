import { SiteFooter } from '../../components/ui/SiteFooter/SiteFooter'
import { FOOTER_LINKS } from '../../config/copy'
import { site } from '../../config/site'
import { HomeAbout } from './HomeAbout'
import { HomeFlow } from './HomeFlow'
import { HomeHeader } from './HomeHeader'
import { HomeHero } from './HomeHero'
import styles from './HomePage.module.css'

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
      </main>
      <SiteFooter note={site.tagline} business={site.business} links={FOOTER_LINKS} />
    </div>
  )
}
