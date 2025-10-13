import { useEffect, useRef, useState, useContext } from 'react'
import { ThemeContext } from '../context/ThemeProvider'

export default function GridLinesInteractive() {
  const { spotlightOn } = useContext(ThemeContext)
  const svgRef = useRef<SVGSVGElement | null>(null)
  const vLinesRef = useRef<Array<SVGLineElement | null>>([])
  const hLinesRef = useRef<Array<SVGLineElement | null>>([])
  const rafRef = useRef<number | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, active: false })
  const [dimensions, setDimensions] = useState({ w: 0, h: 0, left: 0 })

  // grid spacing from CSS var
  function getGridSize() {
    const gs = getComputedStyle(document.documentElement).getPropertyValue('--grid-size') || '48px'
    return parseInt(gs.trim(), 10) || 48
  }

  useEffect(() => {
    function measure() {
      const left = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--sidebar-width') || '288px', 10) || 288
      const w = window.innerWidth - left
      const h = window.innerHeight
      setDimensions({ w, h, left })
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])

  useEffect(() => {
    const svg = svgRef.current
    if (!svg) return

    const gridSize = getGridSize()
    const { w, h } = dimensions
    // create counts
    const vCount = Math.ceil(w / gridSize) + 2
    const hCount = Math.ceil(h / gridSize) + 2

    // ensure arrays length
    vLinesRef.current = new Array(vCount).fill(null)
    hLinesRef.current = new Array(hCount).fill(null)

    // mouse handling only on fine pointers and spotlight enabled
    const mq = window.matchMedia('(pointer: fine)')
    const wide = window.matchMedia('(min-width: 1200px)')
    const enabled = mq.matches && wide.matches && spotlightOn

    let mounted = true

    function updateHighlight() {
      if (!mounted) return
      const mx = mouseRef.current.x
      const my = mouseRef.current.y
      const radius = 56 // smaller, focused radius
      const baseOpacity = 0.06
      const maxOpacity = 0.6

      // vertical lines: only affect nearby lines
      for (let i = 0; i < vLinesRef.current.length; i++) {
        const line = vLinesRef.current[i]
        if (!line) continue
        const lx = i * gridSize + (dimensions.left % gridSize)
        const dist = Math.abs(mx - lx)
        if (dist > radius) {
          // return to baseline
          line.style.opacity = String(baseOpacity)
          line.setAttribute('stroke-width', '1')
          line.style.stroke = 'rgba(136,120,238,0.12)'
          continue
        }
        let t = Math.max(0, 1 - dist / radius)
        // ease-out curve for smoother falloff
        t = 1 - Math.pow(1 - t, 2)
        const opacity = baseOpacity + t * (maxOpacity - baseOpacity)
        const strokeW = 1 + t * 1.6
        line.style.stroke = 'var(--accent)'
        line.style.opacity = String(opacity)
        line.setAttribute('stroke-width', String(strokeW))
      }

      // horizontal lines
      for (let j = 0; j < hLinesRef.current.length; j++) {
        const line = hLinesRef.current[j]
        if (!line) continue
        const ly = j * gridSize
        const dist = Math.abs(my - ly)
        if (dist > radius) {
          line.style.opacity = String(baseOpacity)
          line.setAttribute('stroke-width', '1')
          line.style.stroke = 'rgba(136,120,238,0.12)'
          continue
        }
        let t = Math.max(0, 1 - dist / radius)
        t = 1 - Math.pow(1 - t, 2)
        const opacity = baseOpacity + t * (maxOpacity - baseOpacity)
        const strokeW = 1 + t * 1.6
        line.style.stroke = 'var(--accent)'
        line.style.opacity = String(opacity)
        line.setAttribute('stroke-width', String(strokeW))
      }

      rafRef.current = null
    }

    function onMove(e: MouseEvent) {
      const svgNode = svgRef.current
      if (!svgNode) return
      const rect = svgNode.getBoundingClientRect()
      mouseRef.current.x = e.clientX - rect.left
      mouseRef.current.y = e.clientY - rect.top
      mouseRef.current.active = true
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(updateHighlight)
    }

    function onLeave() {
      mouseRef.current.active = false
      // fade lines back
      for (const line of [...vLinesRef.current, ...hLinesRef.current]) {
        if (!line) continue
        line.style.opacity = '0.05'
        line.setAttribute('stroke-width', '1')
        line.style.stroke = 'rgba(136,120,238,0.12)'
      }
    }

    // initial render of lines: populate SVG children
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    // vertical lines
    for (let i = 0; i < vCount; i++) {
      const x = i * gridSize + (dimensions.left % gridSize)
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line') as SVGLineElement
      line.setAttribute('x1', String(x))
      line.setAttribute('x2', String(x))
      line.setAttribute('y1', '0')
      line.setAttribute('y2', String(dimensions.h))
  line.setAttribute('stroke', 'rgba(136,120,238,0.12)')
  line.setAttribute('stroke-width', '1')
  line.style.opacity = '0.06'
  line.style.transition = 'stroke 220ms cubic-bezier(.2,.9,.2,1), opacity 220ms cubic-bezier(.2,.9,.2,1), stroke-width 220ms cubic-bezier(.2,.9,.2,1)'
      svg.appendChild(line)
      vLinesRef.current[i] = line
    }
    // horizontal lines
    for (let j = 0; j < hCount; j++) {
      const y = j * gridSize
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line') as SVGLineElement
      line.setAttribute('x1', '0')
      line.setAttribute('x2', String(dimensions.w + dimensions.left))
      line.setAttribute('y1', String(y))
      line.setAttribute('y2', String(y))
  line.setAttribute('stroke', 'rgba(136,120,238,0.12)')
  line.setAttribute('stroke-width', '1')
  line.style.opacity = '0.06'
  line.style.transition = 'stroke 220ms cubic-bezier(.2,.9,.2,1), opacity 220ms cubic-bezier(.2,.9,.2,1), stroke-width 220ms cubic-bezier(.2,.9,.2,1)'
      svg.appendChild(line)
      hLinesRef.current[j] = line
    }

    if (enabled) {
      window.addEventListener('mousemove', onMove)
      window.addEventListener('mouseout', (ev) => { if ((ev as MouseEvent).relatedTarget === null) onLeave() })
      window.addEventListener('mouseleave', onLeave)
    }

    return () => {
      mounted = false
      if (enabled) {
        window.removeEventListener('mousemove', onMove)
        window.removeEventListener('mouseleave', onLeave)
      }
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [dimensions, spotlightOn])

  // SVG is positioned over the page content area; pointer-events none so it doesn't block
  return (
    <svg
      ref={svgRef}
      className="grid-lines-svg"
      width="100%"
      height="100%"
      style={{ position: 'fixed', top: 0, left: 0, zIndex: 0, pointerEvents: 'none' }}
      aria-hidden
    />
  )
}
