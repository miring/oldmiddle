import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { site } from './config/site'
import './styles/index.css'

document.title = site.serviceName

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
