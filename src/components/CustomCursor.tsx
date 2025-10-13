import React, { useEffect, useRef } from 'react'

const isTouch = typeof window !== 'undefined' && (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)

function getLuminanceFromRGBA(r: number, g: number, b: number) {
  const Rs = r / 255
  const Gs = g / 255
  const Bs = b / 255
  const R = Rs <= 0.03928 ? Rs / 12.92 : Math.pow((Rs + 0.055) / 1.055, 2.4)
  const G = Gs <= 0.03928 ? Gs / 12.92 : Math.pow((Gs + 0.055) / 1.055, 2.4)
  const B = Bs <= 0.03928 ? Bs / 12.92 : Math.pow((Bs + 0.055) / 1.055, 2.4)
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

const CustomCursor: React.FC = () => {
  const elRef = useRef<HTMLDivElement | null>(null)
  const posRef = useRef({ x: 0, y: 0 })
  const targetRef = useRef({ x: 0, y: 0 })
  const scaleRef = useRef(1)

  useEffect(() => {
    if (isTouch) return

    const el = elRef.current
    if (!el) return

    // inject style to hide native cursor while mounted
    const cls = 'has-custom-cursor'
    const style = document.createElement('style')
    style.textContent = `.${cls} * { cursor: none !important; } .${cls} a, .${cls} button, .${cls} [role="button"], .${cls} input, .${cls} textarea, .${cls} select { cursor: none !important; }`
    document.documentElement.classList.add(cls)
    document.head.appendChild(style)

    let raf = 0

    function onMove(e: MouseEvent) {
      targetRef.current.x = e.clientX
      targetRef.current.y = e.clientY

      const node = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null
      if (node && el) {
        if (node.closest && node.closest('a,button,input,textarea,select,[role="button"]')) {
          scaleRef.current = 1.6
          el.classList.add('cc-hover')
        } else {
          scaleRef.current = 1
          el.classList.remove('cc-hover')
        }

        const styleNode = getComputedStyle(node)
        const bg = styleNode.backgroundColor || ''
        if (bg && bg.startsWith('rgb')) {
          const nums = bg.replace(/rgba?\(|\)/g, '').split(',').map(s => parseFloat(s.trim()))
          if (nums.length >= 3) {
            const lum = getLuminanceFromRGBA(nums[0], nums[1], nums[2])
            if (lum < 0.45) el.classList.add('cc-invert')
            else el.classList.remove('cc-invert')
          }
        }
      }
    }

    function onEnter() { if (el) el.style.opacity = '1' }
    function onLeave() { if (el) el.style.opacity = '0' }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseenter', onEnter)
    window.addEventListener('mouseleave', onLeave)

    function loop() {
      const p = posRef.current
      const t = targetRef.current
      p.x += (t.x - p.x) * 0.16
      p.y += (t.y - p.y) * 0.16
      if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${scaleRef.current})`
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseenter', onEnter)
      window.removeEventListener('mouseleave', onLeave)
      document.documentElement.classList.remove(cls)
      style.remove()
    }
  }, [])

  if (isTouch) return null

  return (
    <div aria-hidden className="custom-cursor" ref={elRef}>
      <div className="custom-cursor-core" />
    </div>
  )
}

export default CustomCursor
