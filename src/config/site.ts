// 서비스명은 코드 곳곳에 쓰지 않고 이 설정값만 참조합니다. 표기는 '시연(時緣)'으로 통일합니다.
export const site = {
  serviceName: '시연(時緣)',
  isTentativeName: false,
  tentativeLabel: '가칭',
  /** 카카오톡 채널 주소. 비어 있으면 신청 완료 화면의 [카카오톡 채널 추가하기]를 숨깁니다 */
  kakaoChannelUrl: '',
} as const
