import { useEffect } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMe } from '../../mocks/matches'
import type { AppRoute } from './appRoute'
import { AppScreen } from './AppScreen'
import { AvailabilityScreen } from './AvailabilityScreen'
import { ArchiveScreen } from './ArchiveScreen'
import { DecideScreen } from './DecideScreen'
import { MatchesScreen } from './MatchesScreen'
import { MyInfoScreen } from './MyInfoScreen'
import { HOME_HASH, navigate } from '../quiz/quizRoute'
import { endPreviewSession, startPreviewSession } from './memberSession'
import { ReportScreen } from './ReportScreen'
import styles from './Matching.module.css'

/** 로그아웃하고 정식 홈으로. 정식 홈 헤더는 다시 그려질 때 로그인 상태를 읽으므로 새로고침 없이 '로그인·가입하기'로 바뀝니다 */
function signOut() {
  endPreviewSession()
  navigate(HOME_HASH)
}

/** 회원 화면 (#/app). 더미 데이터로 '나의 매칭'·'내 정보'를 만들고, 오늘의 추천·약속은 '준비 중' 자리입니다 */
export function MemberApp({ route }: { route: AppRoute }) {
  const routeKey = JSON.stringify(route)

  // 미리보기 로그인: 회원 앱을 열면 로그인한 것으로 보고, 정식 홈 헤더에 이름이 보입니다
  useEffect(() => {
    startPreviewSession(getMe().name)
  }, [])
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [routeKey])

  switch (route.screen) {
    case 'matches':
      return <MatchesScreen matchId={route.matchId} mode="detail" />
    case 'write':
      return <MatchesScreen matchId={route.matchId} mode="write" />
    case 'decide':
      return <DecideScreen matchId={route.matchId} />
    case 'archive':
      return <ArchiveScreen />
    case 'report':
      return <ReportScreen matchId={route.matchId} />
    case 'me':
      return <MyInfoScreen onSignOut={signOut} />
    case 'availability':
      return <AvailabilityScreen />
    case 'placeholder':
      return (
        <AppScreen title={MATCHING_COPY.tabs[route.tab]} tab={route.tab} nav={route.tab}>
          <div className={`${styles.placeholder} flex flex-col items-center gap-2 py-16`}>
            <h1 className={styles.placeholderTitle}>{MATCHING_COPY.tabs[route.tab]}</h1>
            <p>{MATCHING_COPY.preparing}</p>
          </div>
        </AppScreen>
      )
  }
}
