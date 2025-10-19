/**
 * Haptic Toggle Component
 * Allows users to enable/disable haptic feedback
 */

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { hapticManager } from '../utils/hapticManager'

const HapticToggle = () => {
  const [hapticEnabled, setHapticEnabled] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const popupRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Render only on client so navigator detection is accurate on deployed sites
  useEffect(() => {
    setMounted(true)
    const supported = hapticManager.isSupported()
    const enabled = hapticManager.isEnabled()
    
    // Debug logging for Safari mobile
    console.log('HapticToggle Debug:', {
      mounted: true,
      supported,
      enabled,
      hasNavigator: typeof navigator !== 'undefined',
      hasVibrate: typeof navigator !== 'undefined' && 'vibrate' in navigator,
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'N/A'
    })
    
    setHapticEnabled(enabled)
  }, [])

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popupRef.current &&
        buttonRef.current &&
        !popupRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  if (!mounted) {
    console.log('HapticToggle: Not mounted yet')
    return null
  }

  const hapticSupported = hapticManager.isSupported()

  // Don't show the toggle if haptic is not supported
  if (!hapticSupported) {
    console.log('HapticToggle: Not supported, hiding component')
    return null
  }

  console.log('HapticToggle: Rendering button')

  const toggleHaptic = () => {
    const newState = hapticManager.toggle()
    setHapticEnabled(newState)
  }

  const handleOpen = () => {
    setIsOpen(!isOpen)
    hapticManager.click()
  }

  return (
  <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="absolute bottom-20 right-0 bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 p-4 min-w-[240px]"
            style={{
              boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
            }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">📳</span>
                  <span className="text-sm font-medium text-[var(--text)]">Haptic Feedback</span>
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

              <div className="pt-2 border-t border-white/10 dark:border-white/10">
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  Feel subtle vibrations when interacting with buttons and links
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-14 h-14 rounded-full bg-white/10 dark:bg-white/5 backdrop-blur-xl border border-white/20 dark:border-white/10 text-[var(--text)] shadow-lg hover:shadow-xl hover:bg-white/15 dark:hover:bg-white/10 transition-all flex items-center justify-center text-2xl"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Haptic feedback settings"
        style={{
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        }}
      >
        {isOpen ? '✕' : '📳'}
      </motion.button>
    </div>
  )
}

export default HapticToggle
