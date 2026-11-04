/*
 * 회원 앱 주소 (#/app 아래). 기존 해시 방식(quizRoute.ts)을 그대로 쓰고, #/app으로 시작하는 주소만 여기서 나눕니다.
 */

export type AppTab = 'today' | 'matches' | 'meetings' | 'me'

export type AppRoute =
  | { screen: 'matches'; matchId?: string }
  | { screen: 'write'; matchId: string }
  | { screen: 'decide'; matchId: string }
  | { screen: 'archive' }
  | { screen: 'report'; matchId?: string }
  | { screen: 'today' }
  | { screen: 'letter' }
  | { screen: 'kept' }
  | { screen: 'mutual' }
  | { screen: 'me' }
  | { screen: 'availability' }
  | { screen: 'placeholder'; tab: 'meetings' }

export const APP_HASH = '#/app'
export const MATCHES_HASH = '#/app/matches'
export const ARCHIVE_HASH = '#/app/archive'
export const TAB_HASH: Record<AppTab, string> = {
  today: '#/app/today',
  matches: MATCHES_HASH,
  meetings: '#/app/meetings',
  me: '#/app/me',
}

/** 회원 화면 로고를 누르면 가는 첫 화면. 오늘의 추천이 '준비 중'이라 지금은 나의 매칭. 오늘의 추천을 만들면 TAB_HASH.today로 바꿉니다 */
export const MEMBER_HOME_HASH = MATCHES_HASH

/** 오늘의 추천 › 한 줄 편지 / 마음에 담은 분 / 쌍방 매칭 확인 */
export const LETTER_HASH = '#/app/today/letter'
export const KEPT_HASH = '#/app/today/kept'
export const MUTUAL_HASH = '#/app/today/mutual'

/** 내 정보 › 만날 수 있는 때 고치기 */
export const AVAILABILITY_HASH = '#/app/me/availability'

export const matchHash = (id: string) => `${MATCHES_HASH}/${id}`
export const writeHash = (id: string) => `${matchHash(id)}/write`
export const decideHash = (id: string) => `${matchHash(id)}/decide`
export const reportHash = (id?: string) => (id ? `#/app/report/${id}` : '#/app/report')

/** #/app 아래 주소가 아니면 null. 모르는 주소는 나의 매칭 목록으로 */
export function parseAppRoute(hash: string): AppRoute | null {
  if (hash !== APP_HASH && !hash.startsWith(`${APP_HASH}/`)) return null
  const [, , section, id, action] = hash.slice(1).split('/')
  if (section === 'matches' && id) {
    if (action === 'write') return { screen: 'write', matchId: id }
    if (action === 'decide') return { screen: 'decide', matchId: id }
    return { screen: 'matches', matchId: id }
  }
  if (section === 'archive') return { screen: 'archive' }
  if (section === 'report') return { screen: 'report', matchId: id }
  if (section === 'me') return id === 'availability' ? { screen: 'availability' } : { screen: 'me' }
  if (section === 'today') {
    if (id === 'letter') return { screen: 'letter' }
    if (id === 'kept') return { screen: 'kept' }
    if (id === 'mutual') return { screen: 'mutual' }
    return { screen: 'today' }
  }
  if (section === 'meetings') return { screen: 'placeholder', tab: section }
  return { screen: 'matches' }
}
