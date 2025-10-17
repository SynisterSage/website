import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useHaptic } from '../hooks/useHaptic'

const NotFound = () => {
  const { triggerHaptic } = useHaptic()

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="not-found-page page-pad flex flex-col items-center justify-center w-full"
      style={{ minHeight: 'calc(100vh - 180px)' }}
    >
      <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-9xl font-bold text-accent mb-4">404</h1>
          </motion.div>

          <motion.h2
            className="text-3xl font-semibold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Page Not Found
          </motion.h2>

          <motion.p
            className="text-lg text-[var(--muted)] mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            The page you're looking for doesn't exist or has been moved.
          </motion.p>

          <motion.div
            className="flex gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/"
              className="btn-primary"
              onMouseEnter={() => triggerHaptic('hover')}
              onClick={() => triggerHaptic('button')}
            >
              Back to Home
            </Link>
            <Link
              to="/projects"
              className="btn-secondary"
              onMouseEnter={() => triggerHaptic('hover')}
              onClick={() => triggerHaptic('click')}
            >
              View Projects
            </Link>
          </motion.div>
        </div>
    </motion.main>
  )
}

export default NotFound
