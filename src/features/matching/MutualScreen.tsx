import { useEffect } from 'react'
import clock from '../../assets/icons/clock.svg'
import { Button } from '../../components/ui/Button/Button'
import { Notice } from '../../components/ui/Diary/Notice'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { startMatch } from '../../mocks/matches'
import { clearMutual } from '../../mocks/recommend'
import { navigate } from '../quiz/quizRoute'
import { matchHash, TAB_HASH } from './appRoute'
import { AppScreen } from './AppScreen'
import { partnerName } from './matchView'
import { mutualDeadline } from './recommendRules'
import { formatTimeLeft, useRecommendData } from './recommendView'
import styles from './Matching.module.css'
import own from './MyInfo.module.css'

const c = MATCHING_COPY.today.mutual

/**
 * 쌍방 매칭 마지막 확인 (기획서 7장 처리 순서 4). 24시간 안에 [만나볼게요]를 누르면 나의 매칭의 교환일기로 갑니다.
 * TODO(여성 먼저 수락): 성별 정보가 생기면 여성 쪽 확인을 먼저 받고, 두 사람 모두 누른 뒤 교환일기를 엽니다.
 *   지금 더미는 상대가 이미 눌렀다고 보고 바로 엽니다.
 */
export function MutualScreen() {
  const { now, mutual } = useRecommendData()

  // 쌍방 매칭이 없거나 기한이 지났으면 오늘의 추천으로
  useEffect(() => {
    if (!mutual) navigate(TAB_HASH.today, { replace: true })
  }, [mutual])

  if (!mutual) return null
  const r = mutual.recommendation

  const confirm = () => {
    const matchId = startMatch(r.partner, r.id)
    clearMutual()
    navigate(matchHash(matchId), { replace: true })
  }

  return (
    // 본문 제목과 겹치지 않게 상단 바는 탭 이름
    <AppScreen title={MATCHING_COPY.today.title} back={TAB_HASH.today} nav="today">
      <div className="flex flex-col gap-5 xl:mx-auto xl:max-w-(--size-app-card-width)">
        <h1 className={styles.decideTitle}>{c.title}</h1>
        <div className={`${styles.archiveItem} flex items-center gap-4 px-5 py-4.5`}>
          <span className={`${styles.archiveAvatar} flex shrink-0 items-center justify-center`} aria-hidden="true">
            {r.partner.familyName}
          </span>
          <span className="flex min-w-0 flex-1 flex-col gap-0.5">
            <span className={styles.archiveName}>{partnerName(r)}</span>
            <span className={styles.archiveMeta}>
              {r.partner.ageBand} · {r.partner.district}
            </span>
          </span>
        </div>
        <p className={own.value}>{c.body(partnerName(r))}</p>
        <Notice icon={clock}>{formatTimeLeft(mutualDeadline(mutual.matchedAt), now)}</Notice>
        <div className="xl:w-60">
          <Button onClick={confirm}>{c.confirm}</Button>
        </div>
        <p className={own.note}>{c.note}</p>
      </div>
    </AppScreen>
  )
}
