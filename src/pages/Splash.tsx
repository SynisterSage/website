import { useNavigate } from 'react-router-dom'
import LogoPreloader from '../components/LogoPreloader'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <div>
      <LogoPreloader
        duration={3800}
        onComplete={() => {
          const now = Date.now()
          // set cookie for 1 day
          const expires = new Date(now + 7 * 60 * 60 * 1000).toUTCString()
          document.cookie = `splashShownAt=${now}; expires=${expires}; path=/`
          navigate('/', { replace: true })
        }}
      />
    </div>
  )
}
