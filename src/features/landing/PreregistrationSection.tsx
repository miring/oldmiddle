import { PREREGISTRATION_FIELDS } from './landingSteps'
import styles from './LandingSections.module.css'

/** 랜딩 "부담 없는 사전 신청" (Figma "Optional preregistration") — 받을 정보 안내만, 입력 폼은 아님 */
export function PreregistrationSection() {
  return (
    <section
      aria-labelledby="preregistration-title"
      className="flex flex-col gap-5 px-6 py-8 md:gap-10 md:px-12 md:py-16 xl:gap-24 xl:p-24"
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
        <p className={styles.body}>추후 사전 신청에서는 아래 네 가지 정보만 받을 예정이에요.</p>
        <ul role="list" className="grid grid-cols-2 gap-2.5 md:gap-3">
          {PREREGISTRATION_FIELDS.map((field) => (
            <li key={field} className={`${styles.fieldChip} flex min-w-0 items-center`}>
              {field}
            </li>
          ))}
        </ul>
        <p className={styles.body}>이름, 상세 주소, 사진이나 소득은 묻지 않아요.</p>
        <hr className={styles.rule} />
        <p className={styles.body}>
          개인정보 처리 동의는 필수로, 출시·광고 소식 수신 동의는 선택으로 나누어 안내할 예정이에요.
        </p>
      </div>
    </section>
  )
}
