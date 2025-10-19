import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useHaptic } from '../hooks/useHaptic'
import { usePageTitle } from '../hooks/usePageTitle'
import NotFoundGame from '../components/NotFoundGame'

const NotFound = () => {
  usePageTitle('404 - Page Not Found')
  const { triggerHaptic } = useHaptic()
  const [gameActive, setGameActive] = useState(false)

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.code === 'Space' || e.code === 'ArrowUp') && !gameActive) {
        e.preventDefault()
        setGameActive(true)
        triggerHaptic('button')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [gameActive, triggerHaptic])

  const handleActivateGame = () => {
    if (!gameActive) {
      setGameActive(true)
      triggerHaptic('button')
    }
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="not-found-page page-pad flex flex-col items-center justify-center w-full"
      style={{ minHeight: 'calc(100vh - 180px)' }}
    >
      <div className="text-center">
          {/* 404 text or Game */}
          {!gameActive ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 cursor-pointer select-none"
              onClick={handleActivateGame}
              onTouchStart={handleActivateGame}
            >
              <motion.h1 
                className="text-9xl font-bold text-accent mb-4 hover:scale-105 transition-transform relative"
                animate={{
                  textShadow: [
                    '0 0 20px rgba(134, 96, 169, 0.5)',
                    '0 0 40px rgba(134, 96, 169, 0.8)',
                    '0 0 60px rgba(134, 96, 169, 1)',
                    '0 0 40px rgba(134, 96, 169, 0.8)',
                    '0 0 20px rgba(134, 96, 169, 0.5)',
                  ],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                404
              </motion.h1>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <NotFoundGame 
                isActive={gameActive} 
                onClose={() => setGameActive(false)}
              />
            </motion.div>
          )}

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
