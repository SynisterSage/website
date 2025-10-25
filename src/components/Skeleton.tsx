import React from 'react'

interface SkeletonProps {
  className?: string
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
  width?: string | number
  height?: string | number
  count?: number
}

const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'text',
  width,
  height,
  count = 1
}) => {
  const getVariantClass = () => {
    switch (variant) {
      case 'circular':
        return 'rounded-full'
      case 'rectangular':
        return 'rounded-lg'
      case 'card':
        return 'rounded-2xl'
      case 'text':
      default:
        return 'rounded'
    }
  }

  const style: React.CSSProperties = {
    width: width || '100%',
    height: height || (variant === 'text' ? '1em' : '100%'),
  }

  if (count === 1) {
    return (
      <div 
        className={`skeleton ${getVariantClass()} ${className}`}
        style={style}
        aria-hidden="true"
      />
    )
  }

  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div 
          key={index}
          className={`skeleton ${getVariantClass()} ${className}`}
          style={style}
          aria-hidden="true"
        />
      ))}
    </>
  )
}

export default Skeleton
