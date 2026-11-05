# 시연(時緣)

45세 이상을 위한 만남 서비스의 웹사이트입니다 (React · Vite · Tailwind).

## 개발 안내

- **화면 문구와 기능은 [docs/표현-원칙.md](docs/표현-원칙.md)를 따릅니다.**
- 문구는 `src/config`의 설정 파일(`copy.ts`, `matchingCopy.ts` 등)에서만 고칩니다.
- 운영 전에 할 일은 [docs/운영-준비.md](docs/운영-준비.md)에 모아 둡니다.

| 명령 | 하는 일 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run lint` | oxlint + 화면 문구 금지어 검사 (`check:copy`) |
| `npm run check:copy` | 화면 문구 금지어 검사만 |
| `npm run typecheck` | 타입 검사 |
| `npm run build` | 타입 검사 후 빌드 |

`master`에 push하면 GitHub Pages로 자동 배포됩니다. master에 직접 push하지 말고 PR로 올립니다.
