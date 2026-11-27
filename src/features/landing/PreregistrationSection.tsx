import { Button } from '../../components/ui/Button/Button'
import { COPY } from '../../config/copy'
import { PREREGISTER_HASH, navigate } from '../quiz/quizRoute'
import { PREREGISTRATION_FIELDS } from './landingSteps'
import styles from './LandingSections.module.css'

/** 랜딩 "부담 없는 사전 신청" (Figma "Optional preregistration") — 받을 정보 안내 + [사전 신청하기] (입력 폼은 #/preregister) */
export function PreregistrationSection() {
  return (
    <section
      aria-labelledby="preregistration-title"
      className="flex flex-col gap-5 content-gutter py-8 md:gap-10 md:py-16 xl:gap-24 xl:py-24"
    >
      <div className="flex flex-col gap-5 xl:w-(--size-section-intro-width)">
        <p className={styles.label}>부담 없는 사전 신청</p>
        <h2 id="preregistration-title" className={styles.title}>
          가입이 아니라
          <br />
          사전 신청입니다.
        </h2>
        <p className={styles.emphasis}>전화로 권유하지 않습니다.</p>
      </div>

      <div className="flex flex-col gap-5">
        <p className={styles.body}>사전 신청에서는 아래 네 가지 정보만 받아요.</p>
        <ul role="list" className="grid grid-cols-2 gap-2.5 md:gap-3">
          {PREREGISTRATION_FIELDS.map((field) => (
            <li key={field} className={`${styles.fieldChip} flex min-w-0 items-center`}>
              {field}
            </li>
          ))}
        </ul>
        <p className={styles.body}>{COPY.notCollected}</p>
        <hr className={styles.rule} />
        <p className={styles.body}>
          개인정보 처리 동의는 필수로, 출시·광고 소식 수신 동의는 선택으로 나누어 받아요.
        </p>
        <Button className="md:self-start md:min-w-80" onClick={() => navigate(PREREGISTER_HASH)}>
          {COPY.preregisterStart}
        </Button>
      </div>
    </section>
  )
}
