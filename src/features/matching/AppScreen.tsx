import type { ReactNode } from 'react'
import badge from '../../assets/icons/badge.svg'
import calendar from '../../assets/icons/calendar.svg'
import mail from '../../assets/icons/mail.svg'
import users from '../../assets/icons/users.svg'
import { BackHeader } from '../../components/ui/BackHeader/BackHeader'
import { TabBar } from '../../components/ui/Diary/TabBar'
import { SiteFooter } from '../../components/ui/SiteFooter/SiteFooter'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { MEMBER_FOOTER_ABOUT_LABEL } from '../../config/copy'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMe } from '../../mocks/matches'
import { goBackTo, HOME_HASH } from '../quiz/quizRoute'
import { MATCHES_HASH, MEMBER_HOME_HASH, TAB_HASH, type AppTab } from './appRoute'
import { MockControls } from './MockControls'
import styles from './Matching.module.css'

const TAB_ICONS: Record<AppTab, string> = { today: users, matches: mail, meetings: calendar, me: badge }
const TABS: AppTab[] = ['today', 'matches', 'meetings', 'me']
/** 회원 화면 푸터에만 '시연 소개'(정식 홈) 링크를 더합니다 */
const FOOTER_EXTRA_LINKS = [{ label: MEMBER_FOOTER_ABOUT_LABEL, href: HOME_HASH }]

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
 * 회원 화면 틀. 휴대폰·태블릿(1359px까지)은 상단 바 + 하단 탭, 데스크톱은 로고 헤더 + 메뉴. 맨 아래는 공통 푸터.
 * 로고는 모두 회원 첫 화면(MEMBER_HOME_HASH)으로 갑니다.
 * 태블릿은 따로 디자인하지 않고 휴대폰 화면을 최대 폭 안에서 가운데 정렬합니다.
 */
export function AppScreen({ title, back, tab, nav, children }: AppScreenProps) {
  const me = getMe()
  const navItems = [
    ...(['today', 'matches', 'meetings'] as const).map((id) => ({ id, label: MATCHING_COPY.tabs[id], href: TAB_HASH[id] })),
    // 로그인 후에는 '내 정보' 자리에 회원 이름. 누르면 나의 매칭으로
    { id: 'name', label: `${me.name}님`, href: MATCHES_HASH },
  ]

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
              </ul>
            </nav>
          }
        />
      </div>
      <div className="xl:hidden">
        <BackHeader title={title} onBack={back ? () => goBackTo(back) : undefined} homeHref={tab ? MEMBER_HOME_HASH : undefined} />
      </div>
      <main className="content-gutter pt-6 pb-10 xl:pt-10 xl:pb-16">
        {children}
        <MockControls />
      </main>
      {/* 하단 탭이 있으면 푸터가 가리지 않게 탭 높이만큼 아래 여백 */}
      <div className={tab ? styles.withTabBar : undefined}>
        <SiteFooter extraLinks={FOOTER_EXTRA_LINKS} />
      </div>
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
