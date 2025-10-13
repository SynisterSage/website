import React, { createContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light'

interface ThemeContextValue {
  theme: Theme
  toggle: () => void
  spotlightOn?: boolean
  toggleSpotlight?: () => void
}

export const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: () => {},
})

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') return 'dark'
    const saved = localStorage.getItem('theme') as Theme | null
    if (saved) return saved
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    return prefersDark ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    // toggle the 'dark' class only; colors are driven by CSS variables in index.css
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    // don't force nav bg here — CSS variables control light/dark nav appearance
    localStorage.setItem('theme', theme)
  }, [theme])

  const [spotlightOn, setSpotlightOn] = useState<boolean>(() => {
    if (typeof window === 'undefined') return true
    const raw = localStorage.getItem('spotlight')
    if (raw === null) return true
    return raw === '1'
  })

  useEffect(() => {
    try {
      localStorage.setItem('spotlight', spotlightOn ? '1' : '0')
    } catch (e) {
      // ignore
    }
  }, [spotlightOn])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const handler = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark')), spotlightOn, toggleSpotlight: () => setSpotlightOn(s => !s) }}>
      {children}
    </ThemeContext.Provider>
  )
}
