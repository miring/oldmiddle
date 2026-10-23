import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

// 화면 이동 때 스크롤은 각 화면이 직접 맞춤 (브라우저 자동 복원이 늦게 와서 위치가 어긋나는 것 방지)
if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

// 탭 제목·공유 문구는 index.html에 있고, 서비스명은 빌드할 때 src/config/site.ts 값으로 채워집니다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
