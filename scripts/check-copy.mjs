// 화면 문구 금지어 검사 (docs/표현-원칙.md '쓰지 않는 말')
//
// 사용법: npm run check:copy  (npm run lint에서도 함께 돌고, 배포 전 GitHub Actions lint 단계에서 실패하면 배포가 멈춤)
//
// 규칙
// - 대상: src/**/*.ts, src/**/*.tsx의 문자열·템플릿 문자열·JSX 글자, index.html의 <title>·<meta content>
// - 코드 주석은 검사하지 않음 (설명하려고 금지어를 적을 수 있음)
// - import·export 경로 문자열은 검사하지 않음
// - 꼭 필요한 예외는 scripts/check-copy-allow.json에 { file, text, reason }으로 적음 (text가 들어간 문자열만 통과)
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import ts from 'typescript'

const ROOT = new URL('..', import.meta.url).pathname

/** 쓰지 않는 말. label은 실패 메시지에 보이는 이름, instead는 대신 쓸 말 */
const BANNED = [
  { label: '결혼', pattern: /결혼/, instead: '인연, 진지한 만남, 동반자' },
  { label: '중매', pattern: /중매/, instead: '인연, 진지한 만남' },
  { label: '성혼', pattern: /성혼/, instead: '인연, 진지한 만남' },
  { label: '결정사', pattern: /결정사/, instead: '인연, 진지한 만남' },
  { label: '재혼', pattern: /재혼/, instead: '새로운 인연' },
  { label: '혼처', pattern: /혼처/, instead: '인연' },
  { label: '맞선', pattern: /맞선/, instead: '만남, 약속' },
  { label: '중개', pattern: /중개/, instead: '추천, 약속 잡기' },
  { label: '알선', pattern: /알선/, instead: '추천, 약속 잡기' },
  { label: '주선', pattern: /주선/, instead: '추천, 약속 잡기' },
  { label: '매니저', pattern: /매니저/, instead: '추천, 약속 잡기' },
  { label: '큐레이션', pattern: /큐레이션/, instead: '추천' },
  { label: '골라 소개', pattern: /골라\s*(소개|드려|드립)/, instead: '조건이 맞는 분 중에서 한 번 더 살펴봐요' },
  { label: '성사 수수료', pattern: /성사\s*수수료/, instead: '추가 수수료 없음' },
  { label: '가입비', pattern: /가입비/, instead: '가입 심사 무료' },
  { label: '심사비', pattern: /심사비/, instead: '가입 심사 무료' },
  { label: '시니어', pattern: /시니어/, instead: '내 또래, 45세 이상' },
  { label: '노년', pattern: /노년/, instead: '내 또래, 45세 이상' },
  { label: '어르신', pattern: /어르신/, instead: '내 또래' },
  { label: '외로운', pattern: /외로운/, instead: '편안한' },
  { label: '마지막', pattern: /마지막/, instead: '새로운 인연' },
  { label: '늦은', pattern: /늦은/, instead: '새로운 인연' },
  // 서비스명은 화면에서 시연(時緣)으로 (site.serviceName). 알림톡·문자 제목은 이 저장소 밖이라 예외 없음
  { label: "서비스명 '시연' 단독", pattern: /시연(?!\(時緣\))/, instead: '시연(時緣) — site.serviceName' },
]

/** src 아래 .ts·.tsx 파일 */
function sourceFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return /\.tsx?$/.test(name) && !name.endsWith('.d.ts') ? [path] : []
  })
}

/** 파일 속 화면 문구 후보 { text, line } */
function stringsInSource(path) {
  const code = readFileSync(path, 'utf8')
  const source = ts.createSourceFile(path, code, ts.ScriptTarget.Latest, true, path.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS)
  const found = []
  const add = (node, text) => {
    if (text.trim()) found.push({ text, line: source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1 })
  }
  const visit = (node) => {
    // import·export 경로는 화면 문구가 아님
    if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier) return
    if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) add(node, node.text)
    else if (ts.isTemplateExpression(node)) add(node, [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join('…'))
    else if (ts.isJsxText(node)) add(node, node.text)
    ts.forEachChild(node, visit)
  }
  visit(source)
  return found
}

/** index.html의 <title>과 <meta content="…"> */
function stringsInHtml(path) {
  const html = readFileSync(path, 'utf8')
  const lineOf = (index) => html.slice(0, index).split('\n').length
  const found = []
  for (const match of html.matchAll(/<title>([\s\S]*?)<\/title>/g)) found.push({ text: match[1], line: lineOf(match.index) })
  for (const match of html.matchAll(/<meta\b[^>]*\bcontent="([^"]*)"/g)) found.push({ text: match[1], line: lineOf(match.index) })
  return found
}

const allow = JSON.parse(readFileSync(join(ROOT, 'scripts/check-copy-allow.json'), 'utf8'))
const usedAllow = new Set()
const isAllowed = (file, text) => {
  const index = allow.findIndex((item) => item.file === file && text.includes(item.text))
  if (index >= 0) usedAllow.add(index)
  return index >= 0
}

const targets = [
  ...sourceFiles(join(ROOT, 'src')).map((path) => ({ path, strings: stringsInSource(path) })),
  { path: join(ROOT, 'index.html'), strings: stringsInHtml(join(ROOT, 'index.html')) },
]

const problems = []
for (const { path, strings } of targets) {
  const file = relative(ROOT, path)
  for (const { text, line } of strings) {
    const hits = BANNED.filter(({ pattern }) => pattern.test(text))
    if (hits.length > 0 && !isAllowed(file, text)) problems.push({ file, line, text, hits })
  }
}

// 더는 쓰이지 않는 예외는 지우도록 알림 (실패는 아님)
const unusedAllow = allow.filter((_, index) => !usedAllow.has(index))

if (unusedAllow.length > 0) {
  console.warn('check:copy 쓰이지 않는 예외 (scripts/check-copy-allow.json에서 지워 주세요):')
  for (const item of unusedAllow) console.warn(`  - ${item.file}: "${item.text}"`)
}

if (problems.length > 0) {
  console.error(`check:copy 실패: 쓰지 않는 말이 ${problems.length}곳에 있어요 (docs/표현-원칙.md)`)
  for (const { file, line, text, hits } of problems) {
    const shown = text.replace(/\s+/g, ' ').trim()
    console.error(`  ${file}:${line}  "${shown.length > 80 ? `${shown.slice(0, 80)}…` : shown}"`)
    for (const hit of hits) console.error(`    - '${hit.label}' → 대신: ${hit.instead}`)
  }
  console.error('꼭 필요한 예외라면 scripts/check-copy-allow.json에 file·text·reason을 적어 주세요.')
  process.exit(1)
}

const count = targets.reduce((sum, { strings }) => sum + strings.length, 0)
console.log(`check:copy 통과: 파일 ${targets.length}개, 문구 ${count}개에서 쓰지 않는 말이 없어요 (예외 ${usedAllow.size}개)`)
