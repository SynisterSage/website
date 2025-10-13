import { useEffect, useRef, useContext } from 'react'
import { ThemeContext } from '../context/ThemeProvider'

export default function GridSpotlight() {
  const { spotlightOn } = useContext(ThemeContext)
  const spotRef = useRef<HTMLDivElement | null>(null)
  const linesRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const posRef = useRef({ x: 0, y: 0, active: false })
  const prevRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    let mounted = true
    let enabled = false

    const mq = window.matchMedia('(max-width: 1199px)')
    const finePointer = window.matchMedia('(pointer: fine)')

    // If the user has turned the spotlight off in settings, don't enable listeners.
    if (!spotlightOn) {
      // ensure overlays are hidden and remove listeners if present
      const s = spotRef.current
      const l = linesRef.current
      if (s) {
        s.style.opacity = '0'
        s.style.pointerEvents = 'none'
      }
      if (l) {
        l.style.opacity = '0'
        l.style.pointerEvents = 'none'
      }
      // If spotlight is off, we still want to cleanup any previously attached listeners
      // and return early. The effect will re-run when spotlightOn toggles.
      return
    }

    function shouldEnable() {
      return !mq.matches && finePointer.matches
    }

    function updateVars() {
      if (!mounted) return
      const { x, y, active } = posRef.current
      const node = spotRef.current
      const lnode = linesRef.current
      if (node) {
        node.style.setProperty('--mouse-x', x + 'px')
        node.style.setProperty('--mouse-y', y + 'px')
        node.style.opacity = active ? '0.12' : '0'
      }
      if (lnode) {
        lnode.style.setProperty('--mouse-x', x + 'px')
        lnode.style.setProperty('--mouse-y', y + 'px')
        lnode.style.opacity = active ? '0.65' : '0'
      }
      rafRef.current = null
    }

    function onMove(e: MouseEvent) {
      if (!enabled) return
      const node = spotRef.current
      if (!node) return
      const rect = node.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      const prev = prevRef.current
      const dx = x - prev.x
      const dy = y - prev.y
      // subtle drift based on velocity
      const driftX = Math.max(-40, Math.min(40, dx * 0.5))
      const driftY = Math.max(-30, Math.min(30, dy * 0.5))
      const lnode = linesRef.current
      if (lnode) {
        lnode.style.setProperty('--drift-x', driftX + 'px')
        lnode.style.setProperty('--drift-y', driftY + 'px')
      }
      prevRef.current.x = x
      prevRef.current.y = y
      posRef.current.x = x
      posRef.current.y = y
      posRef.current.active = true
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(updateVars)
    }

    function onLeave() {
      posRef.current.active = false
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(updateVars)
    }

    function enableIfNeeded() {
      const should = shouldEnable()
      if (should && !enabled) {
        enabled = true
        window.addEventListener('mousemove', onMove)
        window.addEventListener('mouseleave', onLeave)
        window.addEventListener('mouseout', onMouseOut)
        // make sure spotlight is visible on first movement only
      } else if (!should && enabled) {
        enabled = false
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseleave', onLeave)
        window.removeEventListener('mouseout', onMouseOut)
        posRef.current.active = false
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(updateVars)
      }
    }

    function onMouseOut(ev: MouseEvent) {
      if ((ev as MouseEvent).relatedTarget === null) onLeave()
    }

    // initial attach depending on media query
    enableIfNeeded()

    // Listen for media query changes so we can enable/disable and avoid freeze on resize
    function mqChange() {
      enableIfNeeded()
    }

  mq.addEventListener('change', mqChange)
  finePointer.addEventListener('change', mqChange)

    // respects reduced motion by disabling transitions
    const prm = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (prm.matches) {
      const s = spotRef.current
      const l = linesRef.current
      if (s) s.style.transition = 'none'
      if (l) l.style.transition = 'none'
    }

    return () => {
      mounted = false
      mq.removeEventListener('change', mqChange)
      finePointer.removeEventListener('change', mqChange)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('mouseout', onMouseOut)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [spotlightOn])

    return (
    <>
  <div ref={spotRef} className="grid-spotlight" aria-hidden="true" />
  <div ref={linesRef} className="grid-lines-highlight" aria-hidden="true" />
    </>
  )
}
