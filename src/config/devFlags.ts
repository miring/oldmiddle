/**
 * 개발 중 확인용 목업 플래그. 배포 빌드에서는 항상 꺼집니다.
 *
 * MOCK_SMS_VERIFICATION: 문자 인증을 실제로 보내지 않고, 인증번호 6자리를 입력하면 통과로 처리합니다.
 * TODO(문자 인증): 서버 발송·검증을 붙이면 이 플래그와 목업 처리를 지웁니다. (docs/운영-준비.md)
 */
export const MOCK_SMS_VERIFICATION = import.meta.env.DEV
