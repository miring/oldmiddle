import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { site } from './src/config/site.ts'

/** 외부 확인용 미리보기 빌드(VITE_HOME_PREVIEW=true)는 검색엔진에 노출하지 않습니다. 운영 빌드에는 영향 없음 */
const NOINDEX = process.env.VITE_HOME_PREVIEW === 'true' ? '<meta name="robots" content="noindex, nofollow" />\n  </head>' : '</head>'

/** index.html의 %SERVICE_NAME%을 설정값(src/config/site.ts)의 서비스명으로 바꿉니다 */
function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml: (html) => html.replaceAll('%SERVICE_NAME%', site.serviceName).replace('</head>', NOINDEX),
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages처럼 하위 경로(/저장소이름/)에 올릴 때는 BASE_PATH로 지정합니다. 로컬 개발은 '/'
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), siteMeta()],
})
