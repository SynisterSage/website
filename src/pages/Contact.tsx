import { motion } from 'framer-motion'
import { useState } from 'react'
import LinkedIn from '../components/icons/LinkedIn'
import Instagram from '../components/icons/Instagram'

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
      className="min-h-screen page-pad"
    >
  <div className="content-column contact-page mb-6">
        <motion.h1
          className="text-5xl font-semibold text-accent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Contact Me
        </motion.h1>

        <motion.p
          className="text-lg max-w-3xl mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Feel free to reach out if you have a project idea, or any questions. Use the form below for project inquiries or the contact card to the right.
        </motion.p>

        {/* Responsive two-column: form (left) and contact card + FAQ (right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onSubmit={handleSubmit}
              className="glass rounded-2xl p-8 space-y-6"
            >
              <h2 className="text-2xl font-semibold">Project Inquiry</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
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
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
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
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium mb-2">Existing website (optional)</label>
                <input
                  type="url"
                  id="website"
                  placeholder="https://example.com"
                  className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
                  style={{ color: 'var(--text)' }}
                />
              </div>

              <div>
                <label htmlFor="details" className="block text-sm font-medium mb-2">Project details</label>
                <textarea
                  id="details"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
                  style={{ color: 'var(--text)' }}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium mb-2">Project timeline</label>
                  <input
                    type="text"
                    id="timeline"
                    placeholder="e.g. 3 months, ASAP"
                    className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ color: 'var(--text)' }}
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-medium mb-2">Budget (optional)</label>
                  <input
                    type="text"
                    id="budget"
                    placeholder="e.g. $3k - $10k"
                    className="w-full px-4 py-2 rounded-md glass-light focus:outline-none focus:ring-2 focus:ring-accent"
                    style={{ color: 'var(--text)' }}
                  />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <button
                  type="submit"
                  className="px-8 py-4 bg-accent text-white rounded-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                >
                  Get In Touch
                </button>

                <a href="mailto:afergyy@gmail.com" className="btn-secondary">Email</a>
              </div>
            </motion.form>
          </div>

          <aside className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="glass rounded-2xl p-6"
            >
              <h3 className="text-xl font-semibold mb-2">Let's Connect</h3>
              <p className="text-sm text-[var(--muted)] mb-4">Email</p>
              <a href="mailto:afergyy@gmail.com" className="text-accent font-medium">afergyy@gmail.com</a>

              <div className="w-full h-[1px] my-6 border-t dotted-line" />

              <div className="text-sm text-[var(--muted)] mb-2">Follow Me</div>
              <div className="flex items-center gap-4">
                <a href="https://www.linkedin.com/feed/" aria-label="LinkedIn" className="hover:text-white transition-colors">
                  <LinkedIn className="w-4 h-4" />
                </a>
                <a href="https://www.instagram.com/lexfergusonn/" aria-label="Instagram" className="hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="glass rounded-2xl p-6"
            >
              <h4 className="text-lg font-semibold mb-3">Frequently Asked Questions</h4>
              <ul className="text-sm space-y-3 text-[var(--muted)]">
                <li><strong>How soon will you respond?</strong> — I typically reply within 48 hours for project inquiries. If it's urgent, mark it in the message.
                </li>
                <li><strong>What information should I include?</strong> — A short summary, target timeline, and any links to examples or an existing site help me provide a faster estimate.
                </li>
                <li><strong>Do you sign NDAs or handle sensitive projects?</strong> — Yes — I can sign NDAs and treat all project details privately. Mention it in your message.
                </li>
              </ul>
            </motion.div>
          </aside>
        </div>
      </div>
    </motion.main>
  )
}

export default Contact