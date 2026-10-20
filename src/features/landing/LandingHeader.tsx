import statusDot from '../../assets/landing/status-dot.svg'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import styles from './LandingHeader.module.css'

export function LandingHeader() {
  return (
    <SiteHeader
      fixed
      aside={
        <p className={`${styles.status} flex items-center`}>
          <img className={styles.statusDot} src={statusDot} alt="" />
          준비 중
        </p>
      }
    />
  )
}
