import { Brand } from '../../components/ui/Brand/Brand'
import styles from './LandingSections.module.css'

/** 랜딩 맨 아래 간단한 푸터 (Figma "Minimal footer") */
export function LandingFooter() {
  return (
    <footer className={`${styles.accentSurface} px-6 md:px-12 xl:px-24`}>
      <div className="flex flex-col gap-4.5 pb-7 md:gap-0 md:pb-0">
        <hr className={styles.rule} />
        <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 md:py-8">
          <Brand />
          <p className={styles.footerNote}>천천히, 준비하고 있어요.</p>
        </div>
      </div>
    </footer>
  )
}
