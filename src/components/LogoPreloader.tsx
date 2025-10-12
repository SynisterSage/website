import { useEffect, useRef, useState } from 'react'

interface Props {
  duration?: number // total draw duration in ms
  onComplete?: () => void
}

export default function LogoPreloader({ duration = 3800, onComplete }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null)
  const loopTimerRef = useRef<number | null>(null)
  const finishTimerRef = useRef<number | null>(null)
  const [isRunning] = useState(true)
  const wrapperRef = useRef<HTMLDivElement | null>(null)
  const autoTimerRef = useRef<number | null>(null)
  const prefersReduced = typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    if (!svgRef.current) return
    const paths = Array.from(svgRef.current.querySelectorAll('path')) as SVGPathElement[]
    let totalLength = 0
    paths.map(p => {
      const l = Math.ceil(p.getTotalLength())
      totalLength += l
      p.style.strokeDasharray = String(l)
      p.style.strokeDashoffset = String(l)
      p.style.transition = `stroke-dashoffset ${duration}ms cubic-bezier(.2,.8,.2,1)`
      p.style.stroke = 'var(--accent)'
      // fill handled by CSS (fill-opacity)
      p.style.fill = 'var(--accent)'
      p.style.strokeWidth = '2'
      return l
    })

    // Staggered draw once to appear hand-drawn, then start a looping forward/back animation
    paths.forEach((p, i) => {
      const delay = Math.round((i / paths.length) * (duration * 0.25))
      setTimeout(() => {
        p.style.strokeDashoffset = '0'
      }, delay)
    })

    // If reduced motion, show drawn logo and finish quickly
    if (prefersReduced) {
      const finish = window.setTimeout(() => onComplete && onComplete(), 250)
      return () => clearTimeout(finish)
    }

    // After the initial draw completes, begin looping animation: forward -> backward -> forward...
    const loopStart = duration + 180
    const loopInterval = 1400 // full forward+back cycle duration in ms

    // helper to toggle each path between drawn and hidden with small stagger
    const runLoop = (toDraw: boolean) => {
      paths.forEach((p, i) => {
        const l = Math.ceil(p.getTotalLength())
        const delay = Math.round((i / paths.length) * 120)
        setTimeout(() => {
          p.style.transition = `stroke-dashoffset ${toDraw ? 700 : 600}ms cubic-bezier(.2,.8,.2,1)`
          p.style.strokeDashoffset = toDraw ? '0' : String(l)
        }, delay)
      })
    }

    let forward = false
    const startLoop = () => {
      runLoop(forward)
      forward = !forward
      // schedule next toggle
      loopTimerRef.current = window.setTimeout(startLoop, loopInterval)
    }

    // start loop after initial draw
    finishTimerRef.current = window.setTimeout(() => {
      startLoop()
    }, loopStart)

    return () => {
      if (loopTimerRef.current) clearTimeout(loopTimerRef.current)
      if (finishTimerRef.current) clearTimeout(finishTimerRef.current)
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // auto-exit after 4s
    const autoDelay = 4000
    autoTimerRef.current = window.setTimeout(() => {
      triggerExit()
    }, autoDelay)

    const onAnyClick = () => triggerExit()
    const onAnyKey = (e: KeyboardEvent) => {
      if (!e.metaKey && !e.ctrlKey && !e.altKey) triggerExit()
    }
    window.addEventListener('click', onAnyClick)
    window.addEventListener('keydown', onAnyKey)
    return () => {
      window.removeEventListener('click', onAnyClick)
      window.removeEventListener('keydown', onAnyKey)
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function triggerExit() {
    // guard so we only trigger once
    if (wrapperRef.current && wrapperRef.current.classList.contains('exiting')) return
    if (wrapperRef.current) wrapperRef.current.classList.add('exiting')
    const exitDuration = 540 // matches CSS below
    // wait for exit animation then call onComplete
    window.setTimeout(() => {
      onComplete && onComplete()
    }, exitDuration)
  }

  return (
    <div ref={wrapperRef} className="logo-preloader" role="status" aria-live="polite">
      <div className={`logo-svg-wrap ${isRunning ? 'running' : ''}`}>
        <svg ref={svgRef} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 444.57 300" className="logo-svg" aria-hidden="true">
          <g>
            <path d="M0 0h444.57v300H0z" style={{ fill: 'none' }} />
            <path d="m285.8 181.25-104.62-.26 31.55-31.39 8.89 8.89 9.99-.02-13.86-13.86 16.08-16.01 51.97 52.65z" />
            <path d="M169.71 180.46h-10.94l75.94-75.2L278 148.35h-12.15l-31.21-31.03-64.93 63.14z" />
          </g>
        </svg>
      </div>

      <div className="logo-preloader-caption">Loading...</div>
    </div>
  )
}
