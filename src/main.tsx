import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './styles/index.css'

// 탭 제목·공유 문구는 index.html에 있고, 서비스명은 빌드할 때 src/config/site.ts 값으로 채워집니다.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
