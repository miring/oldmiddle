import statusDot from '../../assets/landing/status-dot.svg'
import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { goHome } from '../quiz/quizRoute'
import styles from './LandingHeader.module.css'

export function LandingHeader() {
  return (
    <SiteHeader
      fixed
      onHomeClick={goHome}
      aside={
        <p className={`${styles.status} flex items-center`}>
          <img className={styles.statusDot} src={statusDot} alt="" />
          준비 중
        </p>
      }
    />
  )
}
