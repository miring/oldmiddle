import arrowBack from '../../../assets/icons/arrow-back.svg'
import { site } from '../../../config/site'
import { Brand } from '../Brand/Brand'
import styles from './BackHeader.module.css'

type BackHeaderProps = {
  title: string
  /** 없으면 뒤로 버튼을 숨깁니다 (예: 신청 완료 화면) */
  onBack?: () => void
  /** 화면 위에 고정. 쓰는 쪽에서 본문 위쪽에 --size-back-header-height만큼 여백을 둡니다 */
  fixed?: boolean
  /** 있으면 뒤로 버튼 대신 왼쪽에 로고를 두고, 누르면 이 주소로 갑니다 (회원 화면 탭 첫 화면) */
  homeHref?: string
}

/**
 * 제목 + 뒤로 버튼 상단 바. 사전 신청 등 한 가지 일을 하는 화면에서 씁니다.
 * homeHref가 있으면 로고(왼쪽) + 제목(오른쪽). 랜딩 헤더처럼 로고 옆에 짧은 글을 두는 배치입니다.
 */
export function BackHeader({ title, onBack, fixed = false, homeHref }: BackHeaderProps) {
  const position = fixed ? 'fixed inset-x-0 top-0 z-(--z-header)' : ''

  if (homeHref) {
    return (
      <header className={`${styles.header} ${position} content-gutter flex items-center justify-between gap-4`}>
        <a href={homeHref} aria-label={`${site.serviceName} 첫 화면으로`} className={`${styles.home} inline-flex items-center`}>
          <Brand />
        </a>
        <p className={styles.title}>{title}</p>
      </header>
    )
  }

  return (
    <header className={`${styles.header} ${position} content-gutter flex items-center gap-1`}>
      {onBack && (
        <button type="button" className={`${styles.back} -ml-3 flex shrink-0 items-center justify-center`} onClick={onBack}>
          <img className={styles.backIcon} src={arrowBack} alt="" />
          <span className="sr-only">뒤로 가기</span>
        </button>
      )}
      <p className={styles.title}>{title}</p>
    </header>
  )
}
