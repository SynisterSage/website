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
          // Navigate back to home after the preloader finishes. We intentionally
          // do not set a cookie so the preloader will run on every fresh navigation
          // (opening the site), but our StartupRedirect logic prevents it on reloads.
          navigate('/', { replace: true })
        }}
      />
    </motion.main>
  )
}
