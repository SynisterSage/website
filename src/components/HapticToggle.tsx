/**
 * Haptic Toggle Component
 * Allows users to enable/disable haptic feedback
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hapticManager } from '../utils/hapticManager'

const HapticToggle = () => {
  const [hapticEnabled, setHapticEnabled] = useState(hapticManager.isEnabled())
  const [isOpen, setIsOpen] = useState(false)
  const hapticSupported = hapticManager.isSupported()

  // Don't show the toggle if haptic is not supported
  if (!hapticSupported) return null

  const toggleHaptic = () => {
    const newState = hapticManager.toggle()
    setHapticEnabled(newState)
  }

  const handleOpen = () => {
    setIsOpen(!isOpen)
    hapticManager.click()
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-16 right-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 min-w-[240px]"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📳</span>
                  <span className="text-sm font-medium">Haptic Feedback</span>
                </div>
                <button
                  onClick={toggleHaptic}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    hapticEnabled ? 'bg-accent' : 'bg-gray-300 dark:bg-gray-700'
                  }`}
                  aria-label="Toggle haptic feedback"
                >
                  <motion.div
                    className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                    animate={{ x: hapticEnabled ? 24 : 0 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Feel subtle vibrations when interacting with buttons and links
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleOpen}
        className="w-14 h-14 rounded-full bg-accent text-white shadow-lg hover:shadow-xl transition-shadow flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Haptic feedback settings"
      >
        {isOpen ? '✕' : '📳'}
      </motion.button>
    </div>
  )
}

export default HapticToggle
