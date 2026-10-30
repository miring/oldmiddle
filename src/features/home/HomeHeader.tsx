import { ButtonLink } from '../../components/ui/Button/Button'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { LOGIN_HASH, SIGNUP_HASH } from '../quiz/quizRoute'
import styles from './HomeHeader.module.css'

/** 데스크톱 헤더 메뉴. target은 각 섹션의 id (섹션이 생기면 그 위치로 이동) */
const MENU = [
  { label: '이용 방법', target: 'home-flow' },
  { label: '사랑하는 방식', target: 'home-love-style' },
  { label: '요금', target: 'home-pricing' },
]

// 주소의 #은 화면 구분에 쓰므로, 메뉴는 링크 대신 버튼으로 해당 섹션까지 스크롤합니다
function scrollToSection(id: string) {
  const section = document.getElementById(id)
  if (!section) return
  section.scrollIntoView({ block: 'start' })
  section.querySelector('h2')?.focus({ preventScroll: true })
}

/** 정식 홈 헤더: 로고 + (데스크톱) 메뉴 + 로그인 + (태블릿 이상) 가입하기 */
export function HomeHeader() {
  return (
    <SiteHeader
      fixed
      onHomeClick={() => window.scrollTo(0, 0)}
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
          <a href={LOGIN_HASH} className={`${styles.login} flex items-center`}>
            로그인
          </a>
          {/* 휴대폰은 첫 화면의 큰 가입하기 버튼만 (Figma 모바일 헤더에는 로그인만) */}
          <span className="hidden md:block">
            <ButtonLink href={SIGNUP_HASH} size="compact">
              가입하기
            </ButtonLink>
          </span>
        </div>
      }
    />
  )
}
