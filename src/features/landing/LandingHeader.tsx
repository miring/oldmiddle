import statusDot from '../../assets/landing/status-dot.svg'
import { Brand } from '../../components/ui/Brand/Brand'
import styles from './LandingHeader.module.css'

export function LandingHeader() {
  return (
    <header className={`${styles.header} flex items-center justify-between px-6 md:px-12 xl:px-24`}>
      <Brand />
      <p className={`${styles.status} flex items-center`}>
        <img className={styles.statusDot} src={statusDot} alt="" />
        준비 중
      </p>
    </header>
  )
}
