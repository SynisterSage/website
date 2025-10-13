import { motion, AnimatePresence } from 'framer-motion'
import React from 'react'

type Props = {
  message?: string
  open: boolean
  variant?: 'success' | 'error'
}

const Toast: React.FC<Props> = ({ message = 'Message sent', open, variant = 'success' }) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
          className="fixed top-6 right-6 z-50"
        >
          <div className={`px-4 py-3 rounded-lg ${variant === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white shadow-lg border border-white/6`}>
            <div className="font-medium">{message}</div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
