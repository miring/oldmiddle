import type { ReactNode } from 'react'
import badge from '../../assets/icons/badge.svg'
import calendar from '../../assets/icons/calendar.svg'
import mail from '../../assets/icons/mail.svg'
import users from '../../assets/icons/users.svg'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { TabBar } from '../../components/ui/Diary/TabBar'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { goBackTo } from '../quiz/quizRoute'
import { MEMBER_HOME_HASH, TAB_HASH, type AppTab } from './appRoute'
import { MockControls } from './MockControls'
import { SignOutButton } from './SignOutButton'
import styles from './Matching.module.css'

const TAB_ICONS: Record<AppTab, string> = { today: users, matches: mail, meetings: calendar, me: badge }
const TABS: AppTab[] = ['today', 'matches', 'meetings', 'me']

type AppScreenProps = {
  /** 휴대폰·태블릿 상단 바 제목 */
  title: string
  /** 있으면 상단 바에 뒤로 버튼. 앱 안에서 넘어오지 않았을 때 갈 주소 */
  back?: string
  /** 휴대폰·태블릿 하단 탭을 보여 줄 때 지금 탭 (탭 첫 화면에서만). 이때 상단 바에는 뒤로 버튼 대신 로고 */
  tab?: AppTab
  /** 데스크톱 헤더에서 강조할 메뉴 */
  nav: AppTab
  children: ReactNode
}

/**
 * 회원 화면 틀. 휴대폰·태블릿(1359px까지)은 상단 바 + 하단 탭, 데스크톱은 로고 헤더 + 메뉴.
 * 푸터는 랜딩·정식 홈에만 두고, 약관·처리방침·문의는 '내 정보 › 서비스 안내'에 둡니다.
 * 로고는 모두 회원 첫 화면(MEMBER_HOME_HASH)으로 갑니다.
 * 태블릿은 따로 디자인하지 않고 휴대폰 화면을 최대 폭 안에서 가운데 정렬합니다.
 */
export function AppScreen({ title, back, tab, nav, children }: AppScreenProps) {
  // 데스크톱 메뉴: 하단 탭과 같은 4개. 로그아웃은 구분선 뒤에 옅은 글자로
  const navItems = TABS.map((id) => ({ id, label: MATCHING_COPY.tabs[id], href: TAB_HASH[id] }))

  return (
    <div className={styles.app}>
      <div className="hidden xl:block">
        <SiteHeader
          homeHref={MEMBER_HOME_HASH}
          aside={
            <nav aria-label="회원 메뉴">
              <ul role="list" className="flex items-center gap-2">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      aria-current={item.id === nav ? 'page' : undefined}
                      className={`${styles.navLink} ${item.id === nav ? styles.navCurrent : ''} flex items-center px-4`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li aria-hidden="true" className={`${styles.navDivider} mx-2`} />
                <li>
                  <SignOutButton variant="nav" />
                </li>
              </ul>
            </nav>
          }
        />
      </div>
      <div className="xl:hidden">
        <BackHeader title={title} onBack={back ? () => goBackTo(back) : undefined} homeHref={tab ? MEMBER_HOME_HASH : undefined} />
      </div>
      <main className={`${tab ? styles.withTabBar : ''} content-gutter pt-6 pb-10 xl:pt-10 xl:pb-16`}>
        {children}
        <MockControls />
      </main>
      {tab && (
        <div className="xl:hidden">
          <TabBar
            items={TABS.map((id) => ({ label: MATCHING_COPY.tabs[id], href: TAB_HASH[id], icon: TAB_ICONS[id], current: id === tab }))}
          />
        </div>
      )}
    </div>
  )
}
