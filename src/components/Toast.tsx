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
          <div className={`glass px-5 py-4 rounded-xl shadow-2xl border ${variant === 'success' ? 'border-green-500/30' : 'border-red-500/30'} backdrop-blur-xl`}>
            <div className="flex items-center gap-3">
              {variant === 'success' ? (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center">
                  <svg className="w-3 h-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
              )}
              <div className="font-medium text-sm">{message}</div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
