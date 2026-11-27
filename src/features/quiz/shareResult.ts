import { site } from '../../config/site'
import { TEST_HASH } from './quizRoute'

/**
 * 테스트 링크 공유 (45세 미만 안내 화면). 기기 공유 창(navigator.share)이 있으면 열고, 없으면 문구를 클립보드에 복사합니다.
 * 첫 화면(/) 대신 #/test를 쓰는 것은, 정식 오픈 뒤 첫 화면이 홈으로 바뀌어도 테스트로 들어오게 하기 위해서입니다.
 * 반환값: 화면에 보여 줄 안내 문구 (없으면 null)
 * (결과 화면은 '내 메일로 결과 받기'로 바뀜: ResultEmailSheet)
 */
function testLinkUrl(): string {
  return `${window.location.origin}${window.location.pathname}${TEST_HASH}`
}

/** 대상(45세 이상 싱글)을 문구에 밝힙니다. */
export async function shareTestLink(): Promise<string | null> {
  return shareLandingLink(`[${site.serviceName}] 1분 동행 유형 테스트`, '45세 이상 싱글을 위한 1분 동행 유형 테스트')
}

async function shareLandingLink(subject: string, text: string): Promise<string | null> {
  const url = testLinkUrl()
  const body = `${text}\n${url}`

  // 휴대폰 등 기기 공유 창을 쓸 수 있으면 그 창을 엽니다 (카카오톡·문자·메일 중 사용자가 고름)
  if (navigator.share) {
    try {
      await navigator.share({ title: subject, text, url })
      return null
    } catch (error) {
      // 사용자가 공유 창을 닫은 경우는 안내하지 않음. 그 밖의 실패는 아래 복사로 넘어감
      if (error instanceof DOMException && error.name === 'AbortError') return null
    }
  }

  // 공유 창이 없는 PC 브라우저: 메일 앱(mailto)은 계정이 없으면 '계정 추가' 창만 떠서, 문구 복사로 대신합니다
  try {
    await navigator.clipboard.writeText(body)
    return '공유 문구를 복사했어요. 카카오톡이나 메일에 붙여 넣어 보내 주세요.'
  } catch {
    return `이 브라우저에서는 복사가 되지 않아요. 주소를 직접 알려 주세요: ${url}`
  }
}
