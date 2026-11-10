import type { MouseEvent, ReactNode } from 'react'
import { site } from '../../../config/site'
import { Brand } from '../Brand/Brand'
import styles from './SiteHeader.module.css'

type SiteHeaderProps = {
  /** 오른쪽에 둘 내용. 예: 이름 뜻풀이 (site.tagline) */
  aside?: ReactNode
  /** 화면 위에 고정. 쓰는 쪽에서 본문 위쪽에 헤더 높이(--size-header-height)만큼 여백을 둡니다 */
  fixed?: boolean
  /** 로고를 눌렀을 때 앱 안에서 첫 화면으로 이동하는 처리. 없으면 일반 링크로 이동합니다 */
  onHomeClick?: () => void
  /** 로고 링크 주소. 없으면 지금 페이지 주소(랜딩 첫 화면). 회원 화면은 회원 첫 화면 주소를 넘깁니다 */
  homeHref?: string
}

/** 헤더 오른쪽 이름 뜻풀이 (site.tagline). 랜딩·문항 화면이 같은 모양으로 씁니다 */
export function SiteHeaderTagline() {
  return <p className={styles.tagline}>{site.tagline}</p>
}

/** 로고가 있는 상단 바. 랜딩·문항 화면, 이후 앱 화면에서 함께 씁니다. 로고는 첫 화면 링크입니다. */
export function SiteHeader({ aside, fixed = false, onHomeClick, homeHref }: SiteHeaderProps) {
  const position = fixed ? `${styles.fixed} fixed inset-x-0 top-0 z-(--z-header)` : ''
  const href = homeHref ?? `${window.location.pathname}${window.location.search}`

  const handleHomeClick = (event: MouseEvent<HTMLAnchorElement>) => {
    // Ctrl/⌘ 클릭 등 새 탭 열기는 브라우저에 맡깁니다.
    if (!onHomeClick || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    onHomeClick()
  }

  return (
    <header className={`${styles.header} ${position} flex items-center justify-between content-gutter`}>
      <a
        href={href}
        onClick={handleHomeClick}
        aria-label={`${site.serviceName} 첫 화면으로`}
        className={`${styles.home} inline-flex items-center`}
      >
        <Brand />
      </a>
      {aside}
    </header>
  )
}
