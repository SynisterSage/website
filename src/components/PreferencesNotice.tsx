import { useEffect, useState, useContext, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ThemeContext } from '../context/ThemeProvider'

export default function PreferencesNotice() {
  const [show, setShow] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [hasShownThisSession, setHasShownThisSession] = useState(() => {
    if (typeof window === 'undefined') return false
    try {
      const saved = sessionStorage.getItem('preferencesNoticeShownThisSession')
      return saved === '1'
    } catch {
      return false
    }
  })
  const { theme, spotlightOn } = useContext(ThemeContext)
  const [prevTheme, setPrevTheme] = useState(theme)
  const [prevSpotlight, setPrevSpotlight] = useState(spotlightOn)

  // Clear any existing timer when component unmounts or show changes
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  // Track changes to theme or spotlight and show notice
  useEffect(() => {
    // Don't show on first load
    if (prevTheme === theme && prevSpotlight === spotlightOn) return

    // Only show once per session globally
    if (hasShownThisSession) {
      setPrevTheme(theme)
      setPrevSpotlight(spotlightOn)
      return
    }

    // Show notice when settings change
    setShow(true)
    setHasShownThisSession(true)
    
    // Mark in sessionStorage so it persists across page navigation
    try {
      sessionStorage.setItem('preferencesNoticeShownThisSession', '1')
    } catch {
      // ignore
    }
    
    setPrevTheme(theme)
    setPrevSpotlight(spotlightOn)

    // Clear any existing timer
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    // Auto-dismiss after 3 seconds - guaranteed to run
    timerRef.current = setTimeout(() => {
      setShow(false)
      timerRef.current = null
    }, 3000)
  }, [theme, spotlightOn, hasShownThisSession, prevTheme, prevSpotlight])

  // Also track sidebar changes via storage events (cross-tab)
  useEffect(() => {
    if (hasShownThisSession) return

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'sidebarCollapsed') {
        setShow(true)
        setHasShownThisSession(true)
        try {
          sessionStorage.setItem('preferencesNoticeShownThisSession', '1')
        } catch {
          // ignore
        }
        
        // Clear any existing timer
        if (timerRef.current) {
          clearTimeout(timerRef.current)
        }
        
        // Auto-dismiss after 3 seconds
        timerRef.current = setTimeout(() => {
          setShow(false)
          timerRef.current = null
        }, 3000)
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [hasShownThisSession])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="fixed top-6 right-6 max-w-sm z-[100] preferences-notice"
        >
          <div
            className="p-4 rounded-lg border backdrop-blur-md"
            style={{
              backgroundColor: 'var(--glass-bg-light)',
              borderColor: 'var(--glass-border)',
              boxShadow: 'var(--glass-shadow-sm)',
            }}
          >
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              ✓ Your preferences have been saved locally.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
