import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { site } from './config/site'
import { LandingPage } from './features/landing/LandingPage'
import './styles/index.css'

document.title = site.serviceName

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LandingPage />
  </StrictMode>,
)
