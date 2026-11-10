import { SiteHeader, SiteHeaderTagline } from '../../components/ui/SiteHeader/SiteHeader'
import { goHome } from '../quiz/quizRoute'

export function LandingHeader() {
  return <SiteHeader fixed onHomeClick={goHome} aside={<SiteHeaderTagline />} />
}
