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

type LoaderProps = {
  duration?: number
  onComplete?: () => void
  assets?: string[] // list of asset URLs to preload (images only)
}

function isImageUrl(url: string) {
  return /\.(png|jpe?g|gif|webp|svg)$/i.test(url)
}

export default function ProgressBarLoader({ duration = 3500, onComplete, assets = [] }: LoaderProps) {
  const { triggerHaptic } = useHaptic()
  const accent = useAccent()
  const [progress, setProgress] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const controls = useAnimationControls()
  const started = useRef(false)
  const fastRef = useRef({ multiplier: 1 })
  const holding = useRef(false)
  const holdStart = useRef<number | null>(null)
  const skipOverride = useRef(false)

  // Asset preload state
  const [assetCounts, setAssetCounts] = useState({ loaded: 0, total: 0 })
  const filteredAssets = useMemo(() => (assets || []).filter(isImageUrl), [assets])

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

      // Determine target gate based on asset loading progress
      const assetGate = assetCounts.total > 0
        ? 0.1 + 0.9 * (assetCounts.loaded / assetCounts.total)
        : 1

      // Visual progress is limited by both time and assets (unless user skip override)
  let visual = skipOverride.current ? 1 : Math.min(eased, assetGate)
      setProgress(visual)

      // step updates every ~ (duration / steps)
      const nextStep = Math.min(steps.length - 1, Math.floor(eased * steps.length))
      if (nextStep !== stepIndex) {
        setStepIndex(nextStep)
        triggerHaptic('hover')
      }

      // When holding, allow skip override after a brief dwell
      if (holding.current && holdStart.current != null && !skipOverride.current) {
        if (t - holdStart.current > 500) {
          skipOverride.current = true
          triggerHaptic('selection')
        }
      }

  const timeDone = pct >= 1
  const assetsDone = assetCounts.total === 0 || assetCounts.loaded >= assetCounts.total
  const canFinish = skipOverride.current || (timeDone && assetsDone)

      if (!canFinish) {
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
        holdStart.current = performance.now()
        setFast(6) // much faster when holding space
      }
    }

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        spaceDown = false
        holding.current = false
        holdStart.current = null
        resetFast()
      }
    }

    const onTouchStart = () => {
      holding.current = true
      holdStart.current = performance.now()
      setFast(5)
    }

    const onTouchEnd = () => {
      holding.current = false
      holdStart.current = null
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

  // Asset preloading effect
  useEffect(() => {
    if (!filteredAssets.length) return
    // initialize counts
    setAssetCounts({ loaded: 0, total: filteredAssets.length })

    let cancelled = false
    filteredAssets.forEach((src) => {
      const img = new Image()
      const done = () => {
        if (cancelled) return
        setAssetCounts((s) => ({ ...s, loaded: Math.min(s.loaded + 1, s.total) }))
      }
      img.onload = done
      img.onerror = done
      // Ensure absolute path works under dev/prod
      img.decoding = 'async'
      img.loading = 'eager'
      img.src = src
    })

    return () => { cancelled = true }
  }, [filteredAssets.join('|')])

  const containerStyle: React.CSSProperties = useMemo(() => ({
    position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', zIndex: 9999,
    padding: '24px',
  }), [])

  return (
    <div className="fixed inset-0" style={{ zIndex: 9998 }}>
      <div style={containerStyle}>
        <div className="w-full max-w-xl rounded-xl p-[1px]" style={{ background: 'linear-gradient(90deg, color-mix(in srgb, var(--accent), white 25%), transparent)' }}>
          <div className="rounded-xl progress-loader-container p-8 backdrop-blur-md border" style={{ borderColor: 'var(--glass-border, rgba(255,255,255,0.10))' }} data-pointer-type={typeof window !== 'undefined' && ('ontouchstart' in window ? 'coarse' : 'fine')}>
            
            {/* AF Logo - centered at top of card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="splash-logo-container mb-8"
            >
              <img 
                src="/icons/logo.svg" 
                alt="A.F. Logo" 
                className="splash-logo"
                style={{
                  filter: `drop-shadow(0 0 20px ${accent}40) drop-shadow(0 0 40px ${accent}20)`,
                }}
              />
            </motion.div>

            {/* Progress Bar */}
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
              <div className="text-xs text-[color:var(--muted)] loader-hint" aria-live="polite">Hold to skip</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
