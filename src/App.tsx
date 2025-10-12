import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Home from './pages/Home'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Sidebar collapsed={sidebarCollapsed} onCollapsedChange={setSidebarCollapsed} />

  <main style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '72px' : '18rem' }} className={`main-content w-full`}>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="w-full">
          <div style={{ ['--sidebar-width' as any]: sidebarCollapsed ? '72px' : '18rem' }} className={`w-full main-content py-6 mt-16 border-t dotted-line`}>
            <div className="px-8 content-column w-full flex justify-between items-center">
                <div className="text-sm text-gray-600">Designed in Framer By Alexander</div>
                <div className="text-sm text-gray-600">© Copyright 2025</div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App
