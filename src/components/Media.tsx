import React from 'react'

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
  if (!src) return null

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
        onCanPlay={onLoad}
        onError={onError}
      />
    )
  }

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={src}
      alt={alt}
      className={className || 'w-full h-full object-cover'}
      style={style}
      decoding="async"
      loading="lazy"
      onLoad={onLoad}
      onError={onError}
    />
  )
}
