import { SiteHeader } from '../../components/ui/SiteHeader/SiteHeader'
import { site } from '../../config/site'
import { goHome } from '../quiz/quizRoute'
import styles from './LandingHeader.module.css'

export function LandingHeader() {
  return (
    <SiteHeader
      fixed
      onHomeClick={goHome}
      aside={
        <p className={styles.status}>{site.tagline}</p>
      }
    />
  )
}
