// 서비스명은 코드 곳곳에 쓰지 않고 이 설정값만 참조합니다. 표기는 '시연(時緣)'으로 통일합니다.

/** prelaunch: 첫 화면(/)은 사전 신청 랜딩 / open: 첫 화면은 정식 홈 */
export type SiteMode = 'prelaunch' | 'open'

export const site = {
  /** 정식 오픈 전에는 'prelaunch'. 그동안 정식 홈은 개발 서버의 #/home에서만 미리 봅니다 */
  siteMode: 'prelaunch' as SiteMode,
  serviceName: '시연(時緣)',
  /** 헤더 로고 옆 이름 뜻풀이 */
  tagline: '때가 되어 만난 인연',
  isTentativeName: false,
  tentativeLabel: '가칭',
  /** 카카오톡 채널 주소. 비어 있으면 신청 완료 화면의 [카카오톡 채널 추가하기]를 숨깁니다 */
  kakaoChannelUrl: '',
  /** 푸터 사업자 정보 (통신판매업, 기획서 11장 '사업자 정보 표시'). 비어 있는 항목은 그 줄을 숨깁니다 */
  business: {
    companyName: '', // 상호
    representative: '', // 대표자
    registrationNumber: '', // 사업자등록번호
    mailOrderNumber: '', // 통신판매업 신고번호 (유료 결제 시작 전에 신고)
    address: '', // 사업장 주소
    phone: '', // 연락처
  },
  /** 정식 홈 요금 섹션과 헤더 '요금' 메뉴를 보일지. 통신판매업 신고 전이라 유료 요금을 아직 내보내지 않을 때 false (금액은 copy.ts HOME_PRICING_COPY) */
  showPricing: true,
  /** 정식 홈 '사랑하는 방식' 테스트 미리 해 보기 주소. 비어 있으면 링크를 숨깁니다 */
  loveStylePreviewUrl: '',
  /** 푸터 링크 주소. 비어 있으면 그 링크를 숨깁니다 */
  termsUrl: '',
  privacyUrl: '',
  contactUrl: '',
  /** 내 정보 › 이용권의 환불 규정 주소. 비어 있으면 '준비 중'으로 둡니다 */
  refundPolicyUrl: '',
} as const
