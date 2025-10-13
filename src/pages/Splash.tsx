import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import LogoPreloader from '../components/LogoPreloader'

export default function Splash() {
  const navigate = useNavigate()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad flex items-center justify-center"
    >
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
    </motion.main>
  )
}
