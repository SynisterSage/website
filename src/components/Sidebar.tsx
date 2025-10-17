import React, { useContext, useState, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ThemeContext } from '../context/ThemeProvider'
import { Home, FolderOpen, User, Briefcase, Mail, Moon, Sun, Eye, EyeOff } from 'lucide-react'
import LinkedIn from './icons/LinkedIn'
import Instagram from './icons/Instagram'
import { useHaptic } from '../hooks/useHaptic'

const NavItem: React.FC<{ to: string; icon: React.ReactNode; children: React.ReactNode; collapsed?: boolean }> = ({ to, icon, children, collapsed }) => {
  const { triggerHaptic } = useHaptic()
  const loc = useLocation()
  // Check if current path matches the nav item, or if we're on a sub-route (like /projects/dominos)
  const active = loc.pathname === to || (to !== '/' && loc.pathname.startsWith(to + '/'))

  // build class names conditionally so we don't apply hover/bg pills when collapsed
  const base = 'sidebar-nav-item flex items-center gap-3 px-4 py-3 rounded-md transition-colors group'
  const activeClass = active ? 'active' : ''
  const bgClass = !collapsed && active ? 'bg-white/6' : ''
  const hoverClass = !collapsed && !active ? 'hover:bg-white/3' : ''

  const className = [base, activeClass, bgClass, hoverClass].filter(Boolean).join(' ')

  return (
    <Link
      to={to}
      className={className}
      style={{ color: collapsed ? '#fff' : 'var(--text-nav)' }}
      onMouseEnter={() => triggerHaptic('hover')}
      onClick={() => triggerHaptic('click')}
    >
      <span className="w-6 h-6 flex items-center justify-center text-[18px] opacity-90" style={{ color: 'var(--text-nav)' }}>{icon}</span>
      <span className="text-sm nav-label flex items-center gap-2" style={{ color: 'var(--text-nav)' }}>
        {children}
        {/* If this nav item is "Projects" and path is a sub-route, show a small slug element */}
        {active && to === '/projects' && loc.pathname !== '/projects' && (
          <span className="project-slug">/{loc.pathname.replace('/projects/', '').split('/')[0]}</span>
        )}
      </span>
    </Link>
  )
}

interface SidebarProps {
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onEasterEggTrigger?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onCollapsedChange, onEasterEggTrigger }) => {
  const { triggerHaptic } = useHaptic()
  const { theme, toggle, spotlightOn, toggleSpotlight } = useContext(ThemeContext)
  const location = useLocation()
  
  // Easter egg: track rapid clicks
  const [clickCount, setClickCount] = useState(0)
  const clickTimeoutRef = useRef<number | null>(null)

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerHaptic('click')
    
    // Easter egg click tracking
    const newCount = clickCount + 1
    setClickCount(newCount)
    
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    
    // Check if user clicked 5 times (trigger Easter egg)
    if (newCount >= 5) {
      setClickCount(0)
      if (onEasterEggTrigger) {
        onEasterEggTrigger()
        e.preventDefault()
        return
      }
    }
    
    // Reset click count after 2 seconds
    clickTimeoutRef.current = window.setTimeout(() => {
      setClickCount(0)
    }, 2000)
    
    // If already on home page, scroll to top instead of navigating
    if (location.pathname === '/') {
      e.preventDefault()
      try {
        const main = document.querySelector('.main-content') as HTMLElement | null
        if (main && typeof main.scrollTo === 'function') {
          main.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      } catch {}
    }
    // Otherwise let the Link navigate normally (it will scroll to top via ScrollToTop component)
  }

  return (
    <aside
      className={`sidebar hidden md:flex md:flex-col md:justify-between md:h-screen md:fixed md:left-0 md:top-0 md:pt-6 md:pb-6 md:px-4 glass ${collapsed ? 'sidebar-collapsed' : 'md:w-72'}`}
      style={{ color: 'var(--text-nav)', zIndex: 40 }}
    >
      <div>
  <div className={`flex items-center gap-3 mb-6 px-2 sidebar-header ${collapsed ? 'relative' : ''}`}>
          <Link
            to="/"
            className={`text-2xl font-bold sidebar-title ${collapsed ? 'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2' : ''}`}
            style={{ color: 'var(--text-nav)' }}
            onClick={handleLogoClick}
          >
            A.F.
          </Link>

            {collapsed ? (
            <div style={{ position: 'absolute', left: 'calc(100% + 36px)', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 8 }}>
              <button
                onClick={() => {
                  triggerHaptic('click')
                  onCollapsedChange(!collapsed)
                }}
                aria-label="Collapse sidebar"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-nav)' }}
              >
                {collapsed ? '»' : '«'}
              </button>

              <button
                onClick={() => {
                  triggerHaptic('click')
                  toggleSpotlight && toggleSpotlight()
                }}
                aria-label="Toggle spotlight"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-nav)' }}
              >
                {spotlightOn ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={() => {
                  triggerHaptic('click')
                  toggle()
                }}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-nav)' }}
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          ) : (
            <div className="ml-auto flex items-center gap-2">
              <button
                onClick={() => {
                  triggerHaptic('click')
                  onCollapsedChange(!collapsed)
                }}
                aria-label="Collapse sidebar"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-nav)' }}
              >
                {collapsed ? '»' : '«'}
              </button>
              <button
                onClick={() => {
                  triggerHaptic('click')
                  toggleSpotlight && toggleSpotlight()
                }}
                aria-label="Toggle spotlight"
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                style={{ color: 'var(--text-nav)' }}
              >
                {spotlightOn ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>

              <button
                onClick={() => {
                  triggerHaptic('click')
                  toggle()
                }}
                aria-label="Toggle theme"
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--text-nav)' }}
              >
                {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
              </button>
            </div>
          )}
        </div>

        <div className="text-xs mb-6 px-2 sidebar-subtitle" style={{ color: 'var(--muted)' }}>Web & Visual Designer</div>

        <nav className="flex flex-col gap-2 px-2">
          <NavItem to="/" icon={<Home size={18} />} collapsed={collapsed}>Home</NavItem>
          <NavItem to="/projects" icon={<FolderOpen size={18} />} collapsed={collapsed}>Projects</NavItem>
          <NavItem to="/about" icon={<User size={18} />} collapsed={collapsed}>About</NavItem>
          <NavItem to="/services" icon={<Briefcase size={18} />} collapsed={collapsed}>Services</NavItem>
          <NavItem to="/contact" icon={<Mail size={18} />} collapsed={collapsed}>Contact</NavItem>
        </nav>
      </div>

      <div className="px-2">
        <div className="border-t dotted-line mb-4 pt-4">
          <div className="text-sm pb-4 sidebar-subtitle"
            style={{ color: 'var(--muted)' }}>
            Follow Me
          </div>
        </div>
        <div className="flex gap-4 px-1 social-icons" style={{ color: 'var(--muted)' }}>
          <a 
            href="https://www.linkedin.com/in/lex-ferguson-3056a3275/" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            <LinkedIn className="w-4 h-4" />
          </a>
          <a 
            href="https://www.instagram.com/lexfergusonn/" 
            target="_blank" 
            rel="noreferrer" 
            className="hover:text-white transition-colors"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            <Instagram className="w-4 h-4" />
          </a>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
