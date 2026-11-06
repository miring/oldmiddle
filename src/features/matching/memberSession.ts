/*
 * 더미 로그인. 미리보기 환경에서 회원 앱(#/app)을 한 번 열면 로그인한 것으로 보고, 이 탭을 닫으면 풀립니다.
 * 정식 홈 헤더가 '{이름}님'을 보여 줄 때 씁니다. 더미 데이터 파일을 불러오지 않도록 이름만 따로 저장합니다.
 * TODO(로그인): 토큰 기반 로그인(기획서 13장)을 붙이면 이 파일을 실제 세션으로 바꿉니다.
 */

const STORAGE_KEY = 'siyeon:preview-member'

/** 더미 회원 이름 (mocks/matches.ts의 '나'와 같은 이름) */
export const PREVIEW_MEMBER_NAME = '이수진'

/**
 * 정식 홈 [로그인]을 눌렀을 때의 더미 로그인. 미리보기 환경이면 로그인하고 true, 운영 사이트면 아무것도 하지 않고 false
 * TODO(로그인): 실제 로그인 화면(#/login)을 만들면 이 함수를 지우고 [로그인]이 그 화면으로 가게 합니다.
 */
export function previewSignIn(): boolean {
  // 조건을 그대로 써야 운영 빌드에서 이 부분이 빠집니다
  if (!(import.meta.env.DEV || import.meta.env.VITE_HOME_PREVIEW === 'true')) return false
  startPreviewSession(PREVIEW_MEMBER_NAME)
  return true
}

export function startPreviewSession(name: string) {
  try {
    sessionStorage.setItem(STORAGE_KEY, name)
  } catch {
    // 저장소를 쓸 수 없으면 로그인하지 않은 상태로 둡니다
  }
}

// TODO(로그인): 실제 로그인(토큰 기반, 기획서 13장)을 붙이면 로그아웃도 실제 세션을 끊도록 바꿉니다.
export function endPreviewSession() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // 위와 같음
  }
}

/** 로그인한 회원 이름. 로그인 전이거나 운영 사이트면 null */
export function getSignedInName(): string | null {
  // 조건을 그대로 써야 운영 빌드에서 이 부분이 빠집니다
  if (!(import.meta.env.DEV || import.meta.env.VITE_HOME_PREVIEW === 'true')) return null
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}
