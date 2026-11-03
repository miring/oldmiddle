import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { site } from '../../config/site'
import { MATCHES_HASH } from '../matching/appRoute'
import { getSignedInName } from '../matching/memberSession'
import { LOGIN_HASH, SIGNUP_HASH } from '../quiz/quizRoute'
import styles from './HomeHeader.module.css'

/** 데스크톱 헤더 메뉴. target은 각 섹션의 id. '요금'은 요금 섹션을 숨길 때(site.showPricing = false) 함께 숨깁니다 */
const MENU = [
  { label: '이용 방법', target: 'home-flow' },
  { label: '사랑하는 방식', target: 'home-love-style' },
  ...(site.showPricing ? [{ label: '요금', target: 'home-pricing' }] : []),
]

/** 부드럽게 스크롤. 기기에서 '동작 줄이기'를 켠 분에게는 바로 이동 */
function scrollBehavior(): ScrollBehavior {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
}

// 주소의 #은 화면 구분에 쓰므로, 메뉴는 링크 대신 버튼으로 해당 섹션까지 스크롤합니다
function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return
  section.scrollIntoView({ block: 'start', behavior: scrollBehavior() })
  section.querySelector('h2')?.focus({ preventScroll: true })
}

/** 정식 홈 헤더: 로고 + (데스크톱) 메뉴 + 로그인 + 가입하기 (태블릿·데스크톱 글자 버튼). 로그인 후에는 둘 대신 '{이름}님' */
export function HomeHeader() {
  const memberName = getSignedInName()

  return (
    <SiteHeader
      fixed
      onHomeClick={() => window.scrollTo({ top: 0, behavior: scrollBehavior() })}
      aside={
        <div className="flex items-center gap-6 xl:gap-8">
          <nav aria-label="홈 메뉴" className="hidden xl:block">
            <ul role="list" className="flex items-center gap-8">
              {MENU.map((item) => (
                <li key={item.target}>
                  <button type="button" className={`${styles.menu} flex items-center`} onClick={() => scrollToSection(item.target)}>
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          {memberName ? (
            // 누르면 회원 앱의 나의 매칭으로
            <a href={MATCHES_HASH} className={`${styles.login} ${styles.signup} flex items-center`}>
              {memberName}님
            </a>
          ) : (
            <>
              <a href={LOGIN_HASH} className={`${styles.login} flex items-center`}>
                로그인
              </a>
              {/* 휴대폰은 첫 화면의 큰 가입하기 버튼만 (Figma 모바일 헤더에는 로그인만), 태블릿·데스크톱은 로그인 옆 글자 버튼 */}
              <a href={SIGNUP_HASH} className={`${styles.login} ${styles.signup} hidden items-center md:flex`}>
                가입하기
              </a>
            </>
          )}
        </div>
      }
    />
  )
}
