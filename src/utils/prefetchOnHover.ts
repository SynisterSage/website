// Lightweight prefetch-on-hover utility
// Usage: add attribute `data-prefetch-src="/path/to/image.jpg"` (or comma-separated list)

function prefetchUrl(url: string) {
  try {
    // avoid duplicating links
    const existing = Array.from(document.head.querySelectorAll('link[rel="prefetch"]')).find((l) => l.getAttribute('href') === url)
    if (existing) return
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = url
    link.as = 'image'
    document.head.appendChild(link)
  } catch (e) {
    // noop
  }
}

export function initPrefetchOnHover() {
  // pointerenter bubbles in browsers that support it; fallback to mouseenter if needed
  function handler(e: Event) {
    const target = e.target as HTMLElement
    if (!target) return
    const el = target.closest && (target.closest('[data-prefetch-src]') as HTMLElement | null)
    if (!el) return
    const val = el.getAttribute('data-prefetch-src')
    if (!val) return
    const urls = val.split(',').map(s => s.trim()).filter(Boolean)
    urls.forEach(prefetchUrl)
  }

  // Use capture so delegated events fire reliably
  document.addEventListener('pointerenter', handler, { capture: true })
  // fallback for environments where pointerenter isn't available
  document.addEventListener('mouseenter', handler, { capture: true })
}

export default prefetchUrl
