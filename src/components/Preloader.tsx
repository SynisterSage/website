import React, { useEffect, useRef, useState } from 'react'

interface PreloaderProps {
  duration?: number
  showOnce?: boolean
  onComplete?: () => void
  allowInteraction?: boolean
}

const STORAGE_KEY = 'preloaderShown:v1'

export default function Preloader({
  duration = 4000,
  showOnce = true,
  onComplete,
  allowInteraction = true,
}: PreloaderProps) {
  const [visible, setVisible] = useState(true)
  const [bursting, setBursting] = useState(false)
  const overlayRef = useRef<HTMLDivElement | null>(null)
  const orbRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const targetRef = useRef({ x: 0, y: 0 })
  const posRef = useRef({ x: 0, y: 0 })

  // Respect prefers-reduced-motion
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (showOnce && typeof window !== 'undefined') {
      const shown = localStorage.getItem(STORAGE_KEY)
      if (shown) {
        // Immediately finish
        finish()
        return
      }
    }

    let timeoutId: number | undefined
    // initialize orb in center of viewport so it doesn't start top-left
    if (typeof window !== 'undefined') {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      targetRef.current.x = cx
      targetRef.current.y = cy
      posRef.current.x = cx
      posRef.current.y = cy
      if (orbRef.current) {
        orbRef.current.style.setProperty('--orb-x', `${cx}px`)
        orbRef.current.style.setProperty('--orb-y', `${cy}px`)
      }
    }
    if (!prefersReduced) {
      timeoutId = window.setTimeout(() => {
        triggerBurst()
      }, duration)
    } else {
      // reduced motion -> short fade
      timeoutId = window.setTimeout(() => {
        finish()
      }, 600)
    }

    if (allowInteraction && !prefersReduced) {
      const onMove = (e: MouseEvent) => {
        targetRef.current.x = e.clientX
        targetRef.current.y = e.clientY
      }

      const onTouch = (e: TouchEvent) => {
        if (e.touches && e.touches[0]) {
          targetRef.current.x = e.touches[0].clientX
          targetRef.current.y = e.touches[0].clientY
        }
      }

      window.addEventListener('mousemove', onMove)
      window.addEventListener('touchmove', onTouch)

      const tick = () => {
        const t = targetRef.current
        const p = posRef.current
        // simple lerp
        p.x += (t.x - p.x) * 0.12
        p.y += (t.y - p.y) * 0.12
        if (orbRef.current) {
          orbRef.current.style.setProperty('--orb-x', `${p.x}px`)
          orbRef.current.style.setProperty('--orb-y', `${p.y}px`)
        }
        rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)

      return () => {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('touchmove', onTouch)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        if (timeoutId) clearTimeout(timeoutId)
      }
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function triggerBurst() {
    if (prefersReduced) {
      finish()
      return
    }
    setBursting(true)
    // small delay to let CSS play
    window.setTimeout(() => finish(), 650)
  }

  function finish() {
    if (showOnce && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, '1')
      } catch (e) {
        // ignore
      }
    }
    setVisible(false)
    onComplete && onComplete()
  }

  function onClickOrb() {
    if (!allowInteraction || prefersReduced) return
    triggerBurst()
  }

  function onSkip(e?: React.MouseEvent) {
    e?.stopPropagation()
    finish()
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Enter' || e.key === ' ') {
        finish()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!visible) return null

  return (
    <div
      ref={overlayRef}
      className={`preloader-overlay ${bursting ? 'burst' : ''}`}
      role="status"
      aria-label="Loading site intro"
    >
      <button className="preloader-skip" onClick={onSkip} aria-label="Skip intro">
        Skip
      </button>

      <div
        ref={orbRef}
        className="preloader-orb"
        onClick={onClickOrb}
        style={{ pointerEvents: 'auto' }}
        role="button"
        tabIndex={0}
        aria-hidden={false}
      >
        <div className="orb-core" />
        <div className="orb-glow" />
        <div className="orb-ripple" />
      </div>
    </div>
  )
}
