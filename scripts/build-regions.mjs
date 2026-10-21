// 행정안전부 법정동코드 전체자료(txt) → src/data/regions.json (시·도 / 시·군·구 목록)
//
// 사용법 (갱신 방법은 docs/운영-준비.md 참고):
//   1) https://www.code.go.kr → 법정동코드 → "전체자료" 내려받기 (zip 안의 txt, CP949, 탭 구분)
//   2) node scripts/build-regions.mjs <txt 파일 경로> <기준일 YYYY-MM-DD>
//
// 규칙
// - 폐지여부가 "존재"인 코드만 사용
// - 시·도: 코드 앞 2자리 (뒤 8자리가 0)
// - 시·군·구: 코드 앞 5자리 (뒤 5자리가 0). 일반구가 있는 시(예: 수원시)는 시 대신 "수원시 장안구"처럼 구 단위로 넣음
// - 세종특별자치시처럼 시·군·구가 없는 시·도는 빈 목록
import { readFileSync, writeFileSync } from 'node:fs'

const [input, baseDate] = process.argv.slice(2)
if (!input || !/^\d{4}-\d{2}-\d{2}$/.test(baseDate ?? '')) {
  console.error('사용법: node scripts/build-regions.mjs <법정동코드 전체자료.txt> <기준일 YYYY-MM-DD>')
  process.exit(1)
}

const text = new TextDecoder('euc-kr').decode(readFileSync(input))
const rows = text
  .split(/\r?\n/)
  .slice(1)
  .map((line) => line.split('\t'))
  .filter(([code, name, status]) => /^\d{10}$/.test(code ?? '') && name && status?.trim() === '존재')
  .map(([code, name]) => ({ code, name: name.trim() }))

const districtRows = rows.filter((r) => r.code.endsWith('00000') && !r.code.endsWith('00000000'))
const provinces = rows.filter((r) => r.code.endsWith('00000000'))
// 세종특별자치시는 시·도 행(36000…) 없이 3611000000 한 줄만 있음 → 그 행을 시·도로 사용(시·군·구 없음)
for (const row of districtRows) {
  if (!provinces.some((p) => p.code.slice(0, 2) === row.code.slice(0, 2)) && !row.name.includes(' ')) {
    provinces.push(row)
  }
}
provinces.sort((a, b) => a.code.localeCompare(b.code))

const regions = provinces.map((province) => {
  const prefix = province.code.slice(0, 2)
  const children = districtRows
    .filter((r) => r.code.startsWith(prefix))
    .map((r) => ({ code: r.code.slice(0, 5), name: r.name.slice(province.name.length).trim() }))
    .filter((d) => d.name) // 세종처럼 시·도 이름만 있는 행 제외

  // 일반구가 있는 시(코드 끝자리 0이고, 앞 4자리가 같은 하위 코드가 있음)는 빼고 구만 남김
  const hasGeneralDistricts = (city) =>
    city.code.endsWith('0') && children.some((d) => d !== city && d.code.slice(0, 4) === city.code.slice(0, 4))
  const districts = children.filter((d) => !hasGeneralDistricts(d))

  return { code: prefix, name: province.name, districts }
})

const output = {
  _source: '행정안전부 행정표준코드관리시스템(code.go.kr) 법정동코드 전체자료',
  _baseDate: baseDate,
  _howToUpdate: 'docs/운영-준비.md "지역 목록 갱신" 참고 — node scripts/build-regions.mjs <전체자료.txt> <기준일>',
  regions,
}

const outPath = new URL('../src/data/regions.json', import.meta.url)
writeFileSync(outPath, `${JSON.stringify(output, null, 2)}\n`)
console.log(`시·도 ${regions.length}개, 시·군·구 ${regions.reduce((n, r) => n + r.districts.length, 0)}개 → src/data/regions.json`)
