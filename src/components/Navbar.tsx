import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const menuVariants = {
    open: { opacity: 1, y: 0, transition: { stiffness: 200 } },
    closed: { opacity: 0, y: -10, transition: { stiffness: 200 } },
  }

  return (
    <nav className="fixed w-full z-60 px-6 py-3 mobile-nav glass" style={{ color: 'var(--mobile-text)' }}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold" style={{ color: 'var(--text-nav)' }}>
          A.F.
        </Link>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle menu"
          style={{ zIndex: 120 }}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
        </motion.button>

      </div>

      <motion.div
        initial={isOpen ? 'open' : 'closed'}
        animate={isOpen ? 'open' : 'closed'}
        variants={menuVariants}
        className={`mobile-menu ${isOpen ? 'open' : 'closed'}`}
        style={{ color: 'var(--mobile-text)', zIndex: 110 }}
      >
        <div className="mobile-menu-inner">
          <Link to="/" className="hover:opacity-90 transition-opacity mobile-menu-link" style={{ color: 'var(--text-nav)' }}>
            Home
          </Link>
          <Link to="/projects" className="hover:opacity-90 transition-opacity mobile-menu-link" style={{ color: 'var(--text-nav)' }}>
            Projects
          </Link>
          <Link to="/contact" className="hover:opacity-90 transition-opacity mobile-menu-link" style={{ color: 'var(--text-nav)' }}>
            Contact
          </Link>
        </div>
      </motion.div>
    </nav>
  )
}

export default Navbar