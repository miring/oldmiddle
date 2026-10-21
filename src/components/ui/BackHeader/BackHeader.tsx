import arrowBack from '../../../assets/icons/arrow-back.svg'
import styles from './BackHeader.module.css'

type BackHeaderProps = {
  title: string
  /** 없으면 뒤로 버튼을 숨깁니다 (예: 신청 완료 화면) */
  onBack?: () => void
  /** 화면 위에 고정. 쓰는 쪽에서 본문 위쪽에 --size-back-header-height만큼 여백을 둡니다 */
  fixed?: boolean
}

/** 제목 + 뒤로 버튼 상단 바. 사전 신청 등 한 가지 일을 하는 화면에서 씁니다. */
export function BackHeader({ title, onBack, fixed = false }: BackHeaderProps) {
  const position = fixed ? 'fixed inset-x-0 top-0 z-(--z-header)' : ''

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
