import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { site } from './src/config/site.ts'

/** index.html의 %SERVICE_NAME%을 설정값(src/config/site.ts)의 서비스명으로 바꿉니다 */
function siteMeta(): Plugin {
  return {
    name: 'site-meta',
    transformIndexHtml: (html) => html.replaceAll('%SERVICE_NAME%', site.serviceName),
  }
}

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages처럼 하위 경로(/저장소이름/)에 올릴 때는 BASE_PATH로 지정합니다. 로컬 개발은 '/'
  base: process.env.BASE_PATH || '/',
  plugins: [react(), tailwindcss(), siteMeta()],
})
