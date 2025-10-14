import React, { useState, useEffect, useRef } from 'react'

type Props = {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
  priority?: boolean // Skip lazy loading for above-the-fold images
}

const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src)

export default function Media({ src, alt = '', className = '', style, onLoad, onError, priority = false }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [shouldLoad, setShouldLoad] = useState(priority)
  const elementRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority || shouldLoad) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShouldLoad(true)
            observer.disconnect()
          }
        })
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [priority, shouldLoad])

  if (!src) return null

  const handleLoad = () => {
    setIsLoaded(true)
    onLoad?.()
  }

  const handleError = () => {
    setHasError(true)
    onError?.()
  }

  if (isVideo(src)) {
    return (
      <video
        src={shouldLoad ? src : undefined}
        className={className || 'w-full h-full object-cover'}
        style={{ objectFit: 'cover', ...(style || {}) }}
        playsInline
        muted
        loop
        autoPlay={shouldLoad}
        controls={false}
        onCanPlay={handleLoad}
        onError={handleError}
        preload={priority ? 'auto' : 'none'}
      />
    )
  }

  return (
    <div ref={elementRef} className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 card-placeholder animate-pulse" />
      )}
      {shouldLoad && (
        <img
          src={src}
          alt={alt}
          className={`${className || 'w-full h-full object-cover'} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
          style={style}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  )
}
