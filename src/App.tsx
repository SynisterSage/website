import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect, lazy, Suspense } from 'react'
import Splash from './pages/Splash'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import GridSpotlight from './components/GridSpotlight'
import HapticToggle from './components/HapticToggle'
import PreferencesNotice from './components/PreferencesNotice'
import { initGA, logPageView } from './utils/analytics'

// Lazy load route components for code splitting and faster initial load
const Home = lazy(() => import('./pages/Home'))
const Projects = lazy(() => import('./pages/Projects'))
const ProjectDetail = lazy(() => import('./pages/ProjectDetail'))
const Contact = lazy(() => import('./pages/Contact'))
const About = lazy(() => import('./pages/About'))
const Services = lazy(() => import('./pages/Services'))
const Resume = lazy(() => import('./pages/Resume'))
const NotFound = lazy(() => import('./pages/NotFound'))

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    if (typeof window === 'undefined') return false
    const saved = localStorage.getItem('sidebarCollapsed')
    return saved === '1'
  })
  
  // Persist sidebar state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed ? '1' : '0')
    } catch (e) {
      // ignore
    }
  }, [sidebarCollapsed])
  
  // Initialize Google Analytics once on mount
  useEffect(() => {
    initGA()
  }, [])
  
  function ScrollToTop() {
    const location = useLocation()
    useEffect(() => {
      // Track page view with Google Analytics
      logPageView(location.pathname + location.search)
      
      // Always jump to top on route change so each page opens at the top.
      // Do multiple attempts (immediate, requestAnimationFrame, timeout) to
      // counter any layout transitions that might re-apply a scroll position.
      const scrollTop = () => {
        try {
          const main = document.querySelector('.main-content') as HTMLElement | null
          if (main && typeof main.scrollTo === 'function') main.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
          // also clear legacy properties
          document.documentElement && (document.documentElement.scrollTop = 0)
          document.body && (document.body.scrollTop = 0)
        } catch (e) {
          // ignore
        }
      }

      scrollTop()
      const raf = requestAnimationFrame(() => scrollTop())
      const t = setTimeout(() => scrollTop(), 80)
      return () => { cancelAnimationFrame(raf); clearTimeout(t) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname])
    return null
  }

  // Prevent the browser's native scroll restoration from re-applying previous
  // scroll positions when navigating. We set manual on mount and restore on unmount.
  useEffect(() => {
    try {
      if ('scrollRestoration' in history) {
        const prev = (history as any).scrollRestoration
        ;(history as any).scrollRestoration = 'manual'
        return () => { (history as any).scrollRestoration = prev }
      }
    } catch (e) {
      // ignore
    }
  }, [])

  function StartupRedirect() {
    const navigate = useNavigate()
    const { pathname } = window.location
    function shouldShowSplash(): boolean {
      try {
        // Do not show the splash on a full page reload — only on fresh entries/navigations.
        // Show the splash on fresh navigations (opening the site from a link or typing the URL).
        // Avoid showing on full-page reloads or back/forward navigations.
        try {
          const navEntries = (performance && (performance as any).getEntriesByType) ? (performance as any).getEntriesByType('navigation') : null
          const navType = navEntries && navEntries[0] && navEntries[0].type
          // navType can be 'navigate', 'reload', 'back_forward', or 'prerender'
          return navType === 'navigate'
        } catch (e) {
          // Fallback for older browsers: if performance.navigation exists, treat type 0 as navigate
          // @ts-ignore
          if (window.performance && (window.performance as any).navigation) {
            // 0 = navigate, 1 = reload, 2 = back_forward
            // show only for navigate
            // @ts-ignore
            return (window.performance as any).navigation.type === 0
          }
          return false
        }
      } catch (e) {
        return false
      }
    }

    useEffect(() => {
      try {
        // Only show the splash once per browsing session to avoid accidental replays.
        // We only read the session flag here; the flag will be set after the splash actually completes.
        const alreadyShown = sessionStorage.getItem('splashShown')
        if (pathname !== '/splash' && !alreadyShown && shouldShowSplash()) {
          navigate('/splash', { replace: true })
        }
      } catch (e) {
        // Fallback: if sessionStorage isn't available, fall back to original behavior
        if (pathname !== '/splash' && shouldShowSplash()) navigate('/splash', { replace: true })
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return null
  }

  function LayoutControls() {
    const location = useLocation()
    const onSplash = location.pathname === '/splash'

    if (onSplash) return null

    return (
      <>
        <Navbar />
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />
      </>
    )
  }

  function LayoutFooter() {
    const location = useLocation()
    const onSplash = location.pathname === '/splash'

    if (onSplash) return null

    return (
      <footer className="w-full mt-8">
        <div className={`w-full footer-main py-6 dotted-line`}>
          <div className="content-column w-full footer-content text-sm" style={{ color: 'var(--muted)' }}>
              <div>Designed with React by Alexander</div>
              <div>© Copyright 2025</div>
          </div>
        </div>
      </footer>
    )
  }

  return (
    <Router>
      <div className={`min-h-screen ${sidebarCollapsed ? 'has-collapsed-sidebar' : 'has-expanded-sidebar'}`} style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '72px' : '18rem' }}>
  {/* Startup redirect will send first-time users to /splash */}
  <StartupRedirect />
  <ScrollToTop />
  <LayoutControls />

        <main className="main-content w-full">
          <GridSpotlight />
          <AnimatePresence mode="wait">
            <Suspense fallback={<div className="w-full min-h-screen flex items-center justify-center"><div style={{ color: 'var(--muted)' }}>Loading...</div></div>}>
              <Routes>
                <Route path="/splash" element={<Splash />} />
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:projectId" element={<ProjectDetail />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/services" element={<Services />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>

        <LayoutFooter />
        <HapticToggle />
        <PreferencesNotice />
      </div>
    </Router>
  )
}

export default App
