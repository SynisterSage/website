import React from 'react'

type Props = {
  src: string
  alt?: string
  className?: string
  style?: React.CSSProperties
}

const isVideo = (src: string) => /\.(mp4|webm|ogg)$/i.test(src)

export default function Media({ src, alt = '', className = '', style }: Props) {
  if (!src) return null

  if (isVideo(src)) {
    return (
      <video
        src={src}
        className={className}
        style={style}
        playsInline
        muted
        loop
        autoPlay
        controls={false}
      />
    )
  }

  return (
    // eslint-disable-next-line jsx-a11y/img-redundant-alt
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
    />
  )
}
