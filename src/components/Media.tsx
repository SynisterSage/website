import React, { useState } from 'react'

type Props = {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
  onLoad?: () => void
  onError?: () => void
}

const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src)

export default function Media({ src, alt = '', className = '', style, onLoad, onError }: Props) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)

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
        src={src}
        className={className || 'w-full h-full object-cover'}
        style={{ objectFit: 'cover', ...(style || {}) }}
        playsInline
        muted
        loop
        autoPlay
        controls={false}
        onCanPlay={handleLoad}
        onError={handleError}
      />
    )
  }

  return (
    <div className="relative w-full h-full">
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 card-placeholder animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className || 'w-full h-full object-cover'} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        style={style}
        decoding="async"
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
      />
    </div>
  )
}
