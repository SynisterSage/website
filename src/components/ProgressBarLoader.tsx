/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import { useHaptic } from '../hooks/useHaptic'

const steps = [
  'Initializing…',
  'Fetching assets…',
  'Compiling shaders…',
  'Preparing layout…',
  'Warming cache…',
  'Final touches…',
]

function useAccent() {
  const [accent, setAccent] = useState('#8878EE')
  useEffect(() => {
    const c = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim()
    if (c) setAccent(c)
  }, [])
  return accent
}

export default function ProgressBarLoader({ duration = 3500, onComplete }: { duration?: number; onComplete?: () => void }) {
  const { triggerHaptic } = useHaptic()
  const accent = useAccent()
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const controls = useAnimationControls()
  const started = useRef(false)
  const fastRef = useRef({ multiplier: 1 })
  const holding = useRef(false)

  useEffect(() => {
    // Kickoff animation and simulated progress. Supports fast-forward multiplier when holding.
    if (started.current) return
    started.current = true
    const startTime = performance.now()

    const tick = () => {
      const t = performance.now()
      const elapsed = (t - startTime) * fastRef.current.multiplier
      const pct = Math.min(1, elapsed / duration)
      const eased = 1 - Math.pow(1 - pct, 2) // easeOutQuad
      setProgress(eased)

      // step updates every ~ (duration / steps)
      const nextStep = Math.min(steps.length - 1, Math.floor(eased * steps.length))
      if (nextStep !== stepIndex) {
        setStepIndex(nextStep)
        triggerHaptic('hover')
      }

      if (pct < 1) {
        requestAnimationFrame(tick)
      } else {
        // complete
        triggerHaptic('success')
        setTimeout(() => onComplete && onComplete(), 150)
      }
    }

    triggerHaptic('button')
    requestAnimationFrame(tick)
  }, [duration])

  // Hold/fast-forward handlers: on desktop use Space key hold; on mobile use touchstart/hold.
  useEffect(() => {
    let spaceDown = false

    const setFast = (mult = 4) => { fastRef.current.multiplier = mult }
    const resetFast = () => { fastRef.current.multiplier = 1 }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !spaceDown) {
        spaceDown = true
        holding.current = true
        setFast(6) // much faster when holding space
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceDown = false
        holding.current = false
        resetFast()
      }
    }

    const onTouchStart = () => {
      holding.current = true
      setFast(5)
    }

    const onTouchEnd = () => {
      holding.current = false
      resetFast()
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchend', onTouchEnd)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 9999,
    padding: '24px',
  }), [])

  return (
    <div className="fixed inset-0" style={{ zIndex: 9998 }}>
      <div style={containerStyle}>
        <div className="w-full max-w-xl rounded-xl p-[1px]" style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent), white 25%), transparent)' }}>
          <div className="rounded-xl progress-loader-container p-4 backdrop-blur-md border" style={{ borderColor: 'var(--glass-border, rgba(255,255,255,0.10))' }} data-pointer-type={typeof window !== 'undefined' && ('ontouchstart' in window ? 'coarse' : 'fine')}>
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-[color:var(--muted)]">{steps[stepIndex]}</div>
              <div className="text-xs text-[color:var(--muted)]">{Math.round(progress * 100)}%</div>
            </div>
            <div className="h-2.5 w-full rounded-md bg-[color:var(--glass-bg-light,rgba(255,255,255,0.06))] overflow-hidden" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress * 100)}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${Math.round(progress * 100)}%` }}
                transition={{ type: 'spring', stiffness: 120, damping: 20, mass: 0.6 }}
                className="h-full rounded-md"
                style={{
                  background: 'linear-gradient(90deg, var(--accent), color-mix(in srgb, var(--accent) 60%, white))',
                  boxShadow: '0 0 24px color-mix(in srgb, var(--accent) 50%, transparent)',
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between glass-hint-row">
              <div className="text-xs tracking-wide text-[color:var(--muted)]">Loading experience</div>
              <div className="text-xs text-[color:var(--muted)] loader-hint" aria-live="polite">
                {/* accessible hint; text changes based on pointer type via JS/CSS */}
                Hold to skip
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
