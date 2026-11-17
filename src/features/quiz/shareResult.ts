import { site } from '../../config/site'
import { TEST_HASH } from './quizRoute'
import type { CompanionResult } from './results'

/**
 * 결과 공유. 메일 쓰기 창(mailto:)을 열고, 공유 문구를 클립보드에도 복사합니다.
 * PC에 메일 앱이 없으면 mailto가 아무 반응이 없으므로, 복사한 문구를 붙여 넣도록 안내합니다.
 * 받는 사람이 남의 결과를 자기 결과로 오해하지 않도록 결과 화면이 아닌 테스트 소개(#/test, 랜딩) 주소를 보냅니다.
 * 첫 화면(/) 대신 #/test를 쓰는 것은, 정식 오픈 뒤 첫 화면이 홈으로 바뀌어도 테스트로 들어오게 하기 위해서입니다.
 * 반환값: 화면에 보여 줄 안내 문구 (없으면 null)
 */
export async function shareResult(result: CompanionResult): Promise<string | null> {
  return shareLandingLink(
    `[${site.serviceName}] 나의 동행 유형 테스트 결과`,
    `나의 동행 유형은 '${result.name}'이래요. 45세 이상 싱글을 위한 1분 테스트, 당신은 어떤 타입일까요?`,
  )
}

/** 테스트 링크만 공유 (결과 없이). 대상(45세 이상 싱글)을 문구에 밝힙니다. */
export async function shareTestLink(): Promise<string | null> {
  return shareLandingLink(`[${site.serviceName}] 1분 동행 유형 테스트`, '45세 이상 싱글을 위한 1분 동행 유형 테스트')
}

async function shareLandingLink(subject: string, text: string): Promise<string | null> {
  const url = `${window.location.origin}${window.location.pathname}${TEST_HASH}`
  const body = `${text}\n${url}`

  // 메일 창으로 화면이 넘어가기 전에 복사를 먼저 끝냅니다.
  let copied = false
  try {
    await navigator.clipboard.writeText(body)
    copied = true
  } catch {
    // 복사가 안 되는 브라우저도 메일 창은 열어 봅니다.
  }

  // 받는 사람은 비워 둡니다.
  window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  return copied
    ? '공유 문구를 복사했어요. 메일 창이 열리지 않으면 복사된 문구를 메일에 붙여 넣어 주세요.'
    : '메일 창이 열리지 않으면 이 브라우저에서는 메일 공유를 쓸 수 없어요.'
}
