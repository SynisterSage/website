import { motion } from 'framer-motion'
import { useState } from 'react'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log(formData)
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 px-8 max-w-7xl mx-auto"
    >
      <motion.h1 
        className="text-4xl font-bold mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Get In Touch
      </motion.h1>

      <motion.p 
        className="text-xl mb-12 max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        Have a project in mind? I'd love to hear about it. Send me a message and I'll get back to you as soon as possible.
      </motion.p>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        onSubmit={handleSubmit}
        className="max-w-2xl space-y-6 glass rounded-2xl p-8"
      >
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ color: 'var(--text)' }}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ color: 'var(--text)' }}
            required
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium mb-2">
            Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
            style={{ color: 'var(--text)' }}
            required
          />
        </div>

        <button
          type="submit"
          className="px-8 py-4 bg-accent text-white rounded-md hover:shadow-lg transition-all hover:-translate-y-0.5"
        >
          Send Message
        </button>
      </motion.form>
    </motion.main>
  )
}

export default Contact