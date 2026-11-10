import { PREREGISTER_SAVE_ENABLED } from '../../config/devFlags'
import styles from './TestModeBanner.module.css'

/** 사전 신청을 실제로 받기 전(PREREGISTER_SAVE_ENABLED = false) 신청 화면 상단에 항상 보이는 안내 띠 */
export function TestModeBanner() {
  if (PREREGISTER_SAVE_ENABLED) return null

  return (
    <div className={`${styles.banner} content-gutter py-2`}>
      <p className={styles.text}>
        {import.meta.env.VITE_SUPABASE_URL ? '테스트 중 · 개발용 DB에 저장돼요' : '테스트 중 · 신청 정보는 저장되지 않아요'}
      </p>
    </div>
  )
}
