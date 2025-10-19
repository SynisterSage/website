import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useHaptic } from '../hooks/useHaptic'
import { usePageTitle } from '../hooks/usePageTitle'
import { logDownload } from '../utils/analytics'
import Toast from '../components/Toast'

const Resume = () => {
  usePageTitle('Resume')
  const { triggerHaptic } = useHaptic()
  const [toastOpen, setToastOpen] = useState(false)
  const [toastMessage, setToastMessage] = useState('Resume downloaded successfully!')
  const [toastVariant, setToastVariant] = useState<'success' | 'error'>('success')

  useEffect(() => {
    if (toastOpen) {
      const timer = setTimeout(() => setToastOpen(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [toastOpen])

  const handleDownload = () => {
    triggerHaptic('button')
    logDownload('Resume PDF')
    
    // Show success toast
    setToastMessage('Resume downloaded successfully!')
    setToastVariant('success')
    setToastOpen(true)
  }
  
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="page-pad"
    >
      <div className="content-column mb-6">
        <motion.h1 
          className="text-5xl font-semibold text-accent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Resume
        </motion.h1>
        <motion.p 
          className="text-lg mb-6 text-[var(--muted)]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Full resume (PDF). Use the controls below to download or view full screen.
        </motion.p>

        <motion.div 
          className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--glass-shadow)] mb-6" 
          style={{ height: '80vh' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <iframe
            src="/icons/FINAL%20RESUME.pdf#zoom=page-width"
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </motion.div>

        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <a 
            href="/icons/FINAL%20RESUME.pdf" 
            className="btn-primary" 
            download
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={handleDownload}
          >
            Download PDF
          </a>
          <Link 
            to="/" 
            className="btn-secondary"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            Back Home
          </Link>
        </motion.div>
      </div>
      <Toast open={toastOpen} message={toastMessage} variant={toastVariant} />
    </motion.main>
  )
}

export default Resume
