// Lightweight prefetch-on-hover utility
// Usage: add attribute `data-prefetch-src="/path/to/image.jpg"` (or comma-separated list)

const prefetchedUrls = new Set<string>()

function prefetchUrl(url: string) {
  try {
    // Skip if already prefetched
    if (prefetchedUrls.has(url)) return
    
    // Use modern fetch API with low priority for better performance
    if ('connection' in navigator && (navigator as any).connection?.saveData) {
      // Skip prefetch on data saver mode
      return
    }

    prefetchedUrls.add(url)

    // Use fetch with low priority instead of link prefetch for better control
    fetch(url, {
      priority: 'low',
      cache: 'force-cache',
    } as RequestInit).catch(() => {
      // Silent fail, remove from cache on error
      prefetchedUrls.delete(url)
    })
  } catch (e) {
    // Fallback to link prefetch if fetch fails
    try {
      const link = document.createElement('link')
      link.rel = 'prefetch'
      link.href = url
      link.as = 'image'
      document.head.appendChild(link)
    } catch {
      // noop
    }
  }
}

let initialized = false

export function initPrefetchOnHover() {
  if (initialized) return
  initialized = true

  // Use passive listeners for better scroll performance
  const handler = (e: Event) => {
    const target = e.target as HTMLElement
    if (!target) return
    const el = target.closest && (target.closest('[data-prefetch-src]') as HTMLElement | null)
    if (!el) return
    const val = el.getAttribute('data-prefetch-src')
    if (!val) return
    const urls = val.split(',').map(s => s.trim()).filter(Boolean)
    urls.forEach(prefetchUrl)
  }

  // Use capture and passive for best performance
  document.addEventListener('pointerenter', handler, { capture: true, passive: true })
  document.addEventListener('mouseenter', handler, { capture: true, passive: true })
}

export default prefetchUrl
