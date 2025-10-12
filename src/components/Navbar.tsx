import { useState, useContext } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X, Moon, Sun, Home as HomeIcon, FolderOpen, Mail as MailIcon, User, Briefcase } from 'lucide-react'
import { ThemeContext } from '../context/ThemeProvider'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { stiffness: 200 } },
    closed: { opacity: 0, y: -10, transition: { stiffness: 200 } },
  }

  const { theme, toggle } = useContext(ThemeContext)

  return (
    <nav className="fixed w-full z-60 px-6 py-3 mobile-nav glass" style={{ color: 'var(--mobile-text)' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left: brand + subtitle */}
        <div className="brand-stack">
          <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--text-nav)' }}>
            A.F.
          </Link>
          <div className="text-sm sidebar-subtitle" style={{ color: 'var(--muted)' }}>Designer</div>
        </div>

        {/* Right: theme toggle + menu */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/6 transition-colors"
            style={{ color: 'var(--text-nav)' }}
          >
            {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <motion.button
            onClick={() => setIsOpen(!isOpen)}
            whileTap={{ scale: 0.95 }}
            aria-label="Toggle menu"
            style={{ zIndex: 120 }}
            className="w-10 h-10 rounded-md flex items-center justify-center border border-transparent hover:border-white/6"
          >
            {isOpen ? <X size={22} /> : <Menu size={22} />}
          </motion.button>
        </div>

      </div>

      <motion.div
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className={`mobile-menu ${isOpen ? 'open' : 'closed'}`}
        style={{ color: 'var(--mobile-text)', zIndex: 110 }}
      >
        <div className="mobile-menu-inner">
          <NavLink to="/" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><HomeIcon size={18} /></span>
            <span>Home</span>
          </NavLink>
          <NavLink to="/projects" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><FolderOpen size={18} /></span>
            <span>Projects</span>
          </NavLink>
          <NavLink to="/about" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><User size={18} /></span>
            <span>About</span>
          </NavLink>
          <NavLink to="/services" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><Briefcase size={18} /></span>
            <span>Services</span>
          </NavLink>
          <NavLink to="/contact" className={({isActive}) => `mobile-menu-link ${isActive ? 'active' : ''}`} style={{ color: 'var(--text-nav)' }}>
            <span className="w-6 h-6 flex items-center justify-center"><MailIcon size={18} /></span>
            <span>Contact</span>
          </NavLink>
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar