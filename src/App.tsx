import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Splash from './pages/Splash'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import ProjectDetail from './pages/ProjectDetail'
import Contact from './pages/Contact'
import About from './pages/About'
import Services from './pages/Services'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  function StartupRedirect() {
    const navigate = useNavigate()
    const { pathname } = window.location
    function getCookie(name: string) {
      const v = document.cookie.match('(?:^|; )' + name + '=([^;]*)')
      return v ? decodeURIComponent(v[1]) : null
    }

    function shouldShowSplash(): boolean {
      try {
        const logged = getCookie('userLoggedInAt')
        if (!logged) return false
        const lastLogged = parseInt(logged, 10)
        if (isNaN(lastLogged)) return false
        const now = Date.now()
  const windowMs = 7 * 60 * 60 * 1000 // 7 hours
  // show only if user logged in within last 7 hours
  if (now - lastLogged > windowMs) return false

        const splashShown = getCookie('splashShownAt')
        if (!splashShown) return true
        const shownAt = parseInt(splashShown, 10)
        if (isNaN(shownAt)) return true
  // if splash was shown more than 7 hours ago, allow again
  if (now - shownAt > windowMs) return true
        return false
      } catch (e) {
        return false
      }
    }

    useEffect(() => {
      if (pathname !== '/splash' && shouldShowSplash()) navigate('/splash', { replace: true })
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
        <div style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '72px' : '18rem' }} className={`w-full footer-main ${sidebarCollapsed ? 'has-collapsed-sidebar' : 'has-expanded-sidebar'} py-6 dotted-line`}>
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
      <div className="min-h-screen">
  {/* Startup redirect will send first-time users to /splash */}
  <StartupRedirect />
  <LayoutControls />

        <main
          style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '72px' : '18rem' }}
          className={`main-content w-full ${sidebarCollapsed ? 'has-collapsed-sidebar' : 'has-expanded-sidebar'}`}
        >
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/splash" element={<Splash />} />
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/projects/:projectId" element={<ProjectDetail />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>

        <LayoutFooter />
      </div>
    </Router>
  )
}

export default App
