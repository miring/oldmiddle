import { site } from '../../../config/site'
import styles from './Brand.module.css'

/** 로고 마크 + 서비스명. 랜딩 헤더와 앱 헤더에서 함께 씁니다. */
export function Brand() {
  return (
    <span className={styles.brand}>
      <span className={styles.mark} aria-hidden="true">
        <span className={`${styles.bar} ${styles.barTall}`} />
        <span className={`${styles.bar} ${styles.barShort}`} />
      </span>
      <span className={styles.wordmark}>{site.serviceName}</span>
      {site.isTentativeName && <span className={styles.tentative}>{site.tentativeLabel}</span>}
    </span>
  )
}
