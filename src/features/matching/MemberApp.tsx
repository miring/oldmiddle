import { useEffect } from 'react'
import { MATCHING_COPY } from '../../config/matchingCopy'
import { getMe } from '../../mocks/matches'
import type { AppRoute } from './appRoute'
import { AppScreen } from './AppScreen'
import { AvailabilityScreen } from './AvailabilityScreen'
import { ArchiveScreen } from './ArchiveScreen'
import { DecideScreen } from './DecideScreen'
import { MatchesScreen } from './MatchesScreen'
import { KeptScreen } from './KeptScreen'
import { LetterScreen } from './LetterScreen'
import { MutualScreen } from './MutualScreen'
import { MyInfoScreen } from './MyInfoScreen'
import { startPreviewSession } from './memberSession'
import { ReportScreen } from './ReportScreen'
import { TodayScreen } from './TodayScreen'
import styles from './Matching.module.css'

/** 회원 화면 (#/app). 더미 데이터로 오늘의 추천·나의 매칭·내 정보를 만들고, 약속은 '준비 중' 자리입니다 */
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
    case 'today':
      return <TodayScreen />
    case 'letter':
      return <LetterScreen />
    case 'kept':
      return <KeptScreen />
    case 'mutual':
      return <MutualScreen />
    case 'me':
      return <MyInfoScreen />
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
