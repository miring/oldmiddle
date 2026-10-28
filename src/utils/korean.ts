/** 마지막 글자 받침 여부. 끝의 괄호 표기는 빼고 봄 ('시연(時緣)' → '시연'). 한글로 끝나지 않으면 null */
function hasFinalConsonant(word: string): boolean | null {
  const base = word.replace(/\s*\([^)]*\)$/, '')
  const code = base.charCodeAt(base.length - 1) - 0xac00
  if (code < 0 || code > 11171) return null
  return code % 28 !== 0
}

/**
 * 낱말 뒤에 붙일 주제 조사(은/는)를 고릅니다. 마지막 글자에 받침이 있으면 '은', 없으면 '는'.
 * 한글로 끝나지 않으면 '은(는)'을 돌려줍니다.
 * 예: topicParticle('시연(時緣)') → '은'
 */
export function topicParticle(word: string): string {
  const final = hasFinalConsonant(word)
  if (final === null) return '은(는)'
  return final ? '은' : '는'
}

/**
 * 낱말 뒤에 붙일 주격 조사(이/가)를 고릅니다. 받침이 있으면 '이', 없으면 '가'.
 * 예: subjectParticle('시연(時緣)') → '이'
 */
export function subjectParticle(word: string): string {
  const final = hasFinalConsonant(word)
  if (final === null) return '이(가)'
  return final ? '이' : '가'
}
