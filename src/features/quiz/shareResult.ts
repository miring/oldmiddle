import { site } from '../../config/site'
import { TEST_HASH } from './quizRoute'
import type { CompanionResult } from './results'

/**
 * 결과 공유. 휴대폰 공유 창(카카오톡 포함)을 먼저 열고,
 * 지원하지 않는 브라우저에서는 공유 문구를 복사합니다.
 * 받는 사람이 남의 결과를 자기 결과로 오해하지 않도록 결과 화면이 아닌 테스트 소개(#/test, 랜딩) 주소를 보냅니다.
 * 첫 화면(/) 대신 #/test를 쓰는 것은, 정식 오픈 뒤 첫 화면이 홈으로 바뀌어도 테스트로 들어오게 하기 위해서입니다.
 * 반환값: 화면에 보여 줄 안내 문구 (없으면 null)
 */
export async function shareResult(result: CompanionResult): Promise<string | null> {
  return shareLandingLink(`나의 동행 유형은 '${result.name}'이래요. 45세 이상 싱글을 위한 1분 테스트, 당신은 어떤 타입일까요?`)
}

/** 테스트 링크만 공유 (결과 없이). 대상(45세 이상 싱글)을 문구에 밝힙니다. */
export async function shareTestLink(): Promise<string | null> {
  return shareLandingLink('45세 이상 싱글을 위한 1분 동행 유형 테스트')
}

async function shareLandingLink(text: string): Promise<string | null> {
  const url = `${window.location.origin}${window.location.pathname}${TEST_HASH}`

  if (navigator.share) {
    try {
      await navigator.share({ title: site.serviceName, text, url })
      return null
    } catch (error) {
      // 사용자가 공유 창을 닫은 경우는 조용히 끝냅니다.
      if (error instanceof DOMException && error.name === 'AbortError') return null
    }
  }

  try {
    await navigator.clipboard.writeText(`${text}\n${url}`)
    return '공유 문구를 복사했어요. 카카오톡 대화창에 붙여 넣어 주세요.'
  } catch {
    return '이 브라우저에서는 공유하기를 쓸 수 없어요.'
  }
}
