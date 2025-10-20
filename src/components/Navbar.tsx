import { useState, useContext, useRef, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun, Home as HomeIcon, FolderOpen, Mail as MailIcon, User, Briefcase } from 'lucide-react'
import { ThemeContext } from '../context/ThemeProvider'
import { useHaptic } from '../hooks/useHaptic'

const Navbar = ({ onEasterEggTrigger }: { onEasterEggTrigger?: () => void }) => {
  const { triggerHaptic } = useHaptic()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  
  // Easter egg: track rapid clicks
  const [clickCount, setClickCount] = useState(0)
  const clickTimeoutRef = useRef<number | null>(null)
  
  // Lock body scroll when menu is open on mobile
  useEffect(() => {
    if (isOpen) {
      // Save current scroll position
      const scrollY = window.scrollY
      document.body.classList.add('menu-open')
      document.body.style.top = `-${scrollY}px`
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top
      document.body.classList.remove('menu-open')
      document.body.style.top = ''
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1)
      }
    }
    
    return () => {
      document.body.classList.remove('menu-open')
      document.body.style.top = ''
    }
  }, [isOpen])

  // Click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node
      
      // Check if click is outside both the menu and the menu button
      if (
        isOpen && 
        menuRef.current && 
        !menuRef.current.contains(target) &&
        menuButtonRef.current &&
        !menuButtonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Small delay to prevent immediate close when opening
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('touchstart', handleClickOutside)
      }, 100)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
    }
  }, [isOpen])

  const { theme, toggle } = useContext(ThemeContext)
  // spotlight toggle handled in Sidebar for desktop
  const loc = useLocation()

  // derived slug for mobile display when on a project detail route
  const projectSlug = loc.pathname.startsWith('/projects/') && loc.pathname !== '/projects' ? '/' + loc.pathname.replace('/projects/', '').split('/')[0] : ''

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    triggerHaptic('click')
    setIsOpen(false)
    
    // Easter egg click tracking
    const newCount = clickCount + 1
    
    // Clear previous timeout
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current)
    }
    
    // Check if user clicked exactly 5 times (trigger Easter egg)
    if (newCount === 5) {
      setClickCount(5) // Keep at 5 to show unlock animation
      if (onEasterEggTrigger) {
        onEasterEggTrigger()
        e.preventDefault()
        // Reset after a delay to allow animation to complete
        setTimeout(() => setClickCount(0), 1000)
        return
      }
    }
    
    // Cap at 5 - don't go higher to prevent accidental closure
    if (newCount > 5) {
      setClickCount(5)
    } else {
      setClickCount(newCount)
    }
    
    // Reset click count after 2 seconds
    clickTimeoutRef.current = window.setTimeout(() => {
      setClickCount(0)
    }, 2000)
    
    // If already on home page, scroll to top instead of navigating
    if (loc.pathname === '/') {
      e.preventDefault()
      try {
        const main = document.querySelector('.main-content') as HTMLElement | null
        if (main && typeof main.scrollTo === 'function') {
          main.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
        }
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      } catch {}
    }
    // Otherwise let the Link navigate normally
  }

  return (
    <nav ref={menuRef} className="fixed w-full z-[1200] mobile-nav-container">
      <div className="mobile-nav glass px-6 py-3" style={{ color: 'var(--mobile-text)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: brand */}
        <Link
          to="/"
          onClick={handleLogoClick}
          className={`brand-link ${clickCount > 0 ? `hint-stage-${clickCount}` : 'hint-stage-0'}`}
          style={{ color: 'var(--text-nav)' }}
        >
          <img 
            src="/icons/logo.svg" 
            alt="A.F. Logo"
            className="brand-logo"
          />
        </Link>

        {/* Right: theme toggle + menu */}
        <div className="flex items-center gap-3">
          {/* Spotlight toggle moved to Sidebar for desktop; not shown in mobile navbar */}
          <button
            onClick={() => {
              triggerHaptic('click')
              toggle()
            }}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/6 transition-colors"
            style={{ color: 'var(--text-nav)' }}
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <button
            ref={menuButtonRef}
            onClick={() => {
              triggerHaptic('click')
              setIsOpen(!isOpen)
            }}
            aria-label="Toggle menu"
            style={{ zIndex: 120 }}
            className="w-10 h-10 rounded-md flex items-center justify-center border border-transparent hover:border-white/6 transition-transform active:scale-95"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        </div>
      </div>

      <div 
        ref={menuRef}
        className={`mobile-menu ${isOpen ? 'open' : 'closed'}`}
        style={{ color: 'var(--mobile-text)' }}
        onClick={(e) => {
          // Close menu if clicking the backdrop (not the menu content)
          if (e.target === e.currentTarget) {
            triggerHaptic('click')
            setIsOpen(false)
          }
        }}
      >
        <div className="mobile-menu-inner">
          <NavLink onClick={() => { triggerHaptic('click'); setIsOpen(false) }} to="/" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><HomeIcon size={18} /></span>
            <span>Home</span>
          </NavLink>
          <NavLink onClick={() => { triggerHaptic('click'); setIsOpen(false) }} to="/projects" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><FolderOpen size={18} /></span>
            <span className="flex items-center gap-2">Projects{projectSlug && <span className="project-slug">{projectSlug}</span>}</span>
          </NavLink>
          <NavLink onClick={() => { triggerHaptic('click'); setIsOpen(false) }} to="/about" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><User size={18} /></span>
            <span>About</span>
          </NavLink>
          <NavLink onClick={() => { triggerHaptic('click'); setIsOpen(false) }} to="/services" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><Briefcase size={18} /></span>
            <span>Services</span>
          </NavLink>
          <NavLink onClick={() => { triggerHaptic('click'); setIsOpen(false) }} to="/contact" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><MailIcon size={18} /></span>
            <span>Contact</span>
          </NavLink>
          {/* Social quick links */}
          <a 
            href="https://www.linkedin.com/in/lex-ferguson-3056a3275/" 
            target="_blank" 
            rel="noreferrer" 
            className="mobile-menu-link"
            onClick={() => triggerHaptic('click')}
          >
            <span className="w-6 h-6 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M4.98 3.5C4.98 4.88 3.88 6 2.49 6C1.11 6 0 4.88 0 3.5C0 2.12 1.11 1 2.49 1C3.88 1 4.98 2.12 4.98 3.5ZM0 8.98H4.98V24H0V8.98ZM8.98 8.98H13.7V10.7H13.77C14.46 9.6 16.08 8.45 18.32 8.45C22.53 8.45 24 10.98 24 15.05V24H18.02V15.98C18.02 13.62 17.98 10.85 15.06 10.85C12.08 10.85 11.6 13.07 11.6 15.78V24H5.62V8.98H8.98Z"/></svg></span>
            <span>LinkedIn</span>
          </a>
          <a 
            href="https://www.instagram.com/lexfergusonn/" 
            target="_blank" 
            rel="noreferrer" 
            className="mobile-menu-link"
            onClick={() => triggerHaptic('click')}
          >
            <span className="w-6 h-6 flex items-center justify-center"><svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M12 2.2C8.8 2.2 8.5 2.2 7.1 2.3C5.7 2.4 4.6 3 3.7 3.9C2.8 4.8 2.2 5.9 2.1 7.3C2 8.7 2 9 2 12.2C2 15.4 2 15.7 2.1 17.1C2.2 18.5 2.8 19.6 3.7 20.5C4.6 21.4 5.7 22 7.1 22.1C8.5 22.2 8.8 22.2 12 22.2C15.2 22.2 15.5 22.2 16.9 22.1C18.3 22 19.4 21.4 20.3 20.5C21.2 19.6 21.8 18.5 21.9 17.1C22 15.7 22 15.4 22 12.2C22 9 22 8.7 21.9 7.3C21.8 5.9 21.2 4.8 20.3 3.9C19.4 3 18.3 2.4 16.9 2.3C15.5 2.2 15.2 2.2 12 2.2ZM12 5.8C15.3 5.8 15.5 5.8 16.9 5.9C17.6 6 18 6.2 18.3 6.4C18.8 6.7 19.2 7.2 19.4 7.9C19.6 8.6 19.6 8.9 19.7 11.2C19.8 13.5 19.8 13.8 19.7 14.5C19.6 15.2 19.4 15.7 19.1 16C18.8 16.3 18.3 16.6 17.6 16.7C16.2 16.9 15.9 16.9 12.6 16.9C9.3 16.9 9 16.9 7.6 16.7C6.9 16.6 6.4 16.3 6.1 16C5.8 15.7 5.6 15.2 5.5 14.5C5.4 13.8 5.4 13.5 5.4 11.2C5.4 8.9 5.4 8.6 5.5 7.9C5.6 7.2 6 6.7 6.5 6.4C6.8 6.2 7.2 6 7.9 5.9C9.3 5.8 9.6 5.8 12 5.8Z"/></svg></span>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </nav>
  )
}

export default Navbar