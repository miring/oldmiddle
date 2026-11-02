import { ButtonLink } from '../../components/ui/Button/Button'
import { HOME_CLOSING_COPY } from '../../config/copy'
import { SIGNUP_HASH } from '../quiz/quizRoute'
import { HomeSection } from './HomeSection'
import styles from './HomeClosing.module.css'

/**
 * 정식 홈 ⑧ 마지막 권유 (Figma "Closing"). 가운데 정렬
 * 휴대폰: 버튼을 화면 폭 가득 / 태블릿 이상: 버튼 폭 280px
 */
export function HomeClosing() {
  return (
    <HomeSection labelledBy="home-closing-title" tone="accent" spacing="closing">
      <div className="flex flex-col items-center gap-5 text-center xl:gap-7">
        <h2 id="home-closing-title" className={styles.message}>
          {HOME_CLOSING_COPY.lines[0]}
          <br />
          {HOME_CLOSING_COPY.lines[1]}
        </h2>
        <div className="w-full md:w-(--size-home-closing-button-width)">
          <ButtonLink href={SIGNUP_HASH}>{HOME_CLOSING_COPY.button}</ButtonLink>
        </div>
      </div>
    </HomeSection>
  )
}
