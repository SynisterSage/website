import React, { useRef, useEffect } from 'react'

type Props = {
  children: React.ReactNode
  className?: string
  disabled?: boolean
}

const TiltCard: React.FC<Props> = ({ children, className = '', disabled = false }) => {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    // reset on mount
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tx', '0deg')
    el.style.setProperty('--ty', '0deg')
    el.style.setProperty('--ax', '0%')
  }, [])

  function handleMove(e: React.MouseEvent) {
    if (disabled) return
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const px = (x / rect.width) - 0.5 // -0.5 .. 0.5
    const py = (y / rect.height) - 0.5
    el.style.setProperty('--tx', `${px * 8}deg`)
    el.style.setProperty('--ty', `${-py * 6}deg`)
    el.style.setProperty('--sx', `${px * 10}px`)
    el.style.setProperty('--sy', `${-py * 6}px`)
    el.style.setProperty('--ax', `${px * 100}%`)
  }

  function handleLeave() {
    if (disabled) return
    const el = ref.current
    if (!el) return
    el.style.setProperty('--tx', '0deg')
    el.style.setProperty('--ty', '0deg')
    el.style.setProperty('--ax', '0%')
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className={`rounded-2xl overflow-hidden ${className}`}
      // inline transform consumes CSS vars set above
      style={{ transform: 'perspective(900px) rotateX(var(--ty)) rotateY(var(--tx))', willChange: 'transform' }}
    >
      {children}
    </div>
  )
}

export default TiltCard
