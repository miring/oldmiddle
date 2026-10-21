import { MOCK_SMS_VERIFICATION } from '../../config/devFlags'
import styles from './TestModeBanner.module.css'

/** 목업 인증이 켜져 있는 동안(저장 로직 연결 전) 신청 화면 상단에 항상 보이는 안내 띠 */
export function TestModeBanner() {
  if (!MOCK_SMS_VERIFICATION) return null

  return (
    <div className={`${styles.banner} content-gutter py-2`}>
      <p className={styles.text}>테스트 중 · 신청 정보는 저장되지 않아요</p>
    </div>
  )
}
