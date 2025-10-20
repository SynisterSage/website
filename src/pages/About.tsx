import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState } from 'react'
import TiltCard from '../components/TiltCard'
import { useHaptic } from '../hooks/useHaptic'
import { usePageTitle } from '../hooks/usePageTitle'
import { projects } from '../data/projects'
import { stackItems } from '../data/stack'

type WorkItem = {
  id: string
  title: string
  date: string
  tag: string
  tech?: string
  description: string
}

const WORK: WorkItem[] = [
  {
    id: 'packanack-app',
    title: 'Packanack Golf Club — Member App',
    date: 'Contract Work • 2025',
    tag: 'Electron • Neon • Firebase',
    tech: 'Electron, Neon, Firebase',
    description:
      'Member-only experience covering tee times, events, and food ordering with real-time status and delivery/pickup, paired with an admin dashboard to track and manage everything—live and in sync—now on the App Store.',
  },
  {
    id: 'packanack-site',
    title: 'Packanack Golf Club — Website Redesign',
    date: 'Contract Work • 2025',
    tag: 'HTML • CSS • JS',
    description:
      'Complete modernization of the UI/UX with a clean, responsive layout on desktop, tablet, and mobile; added interactive course maps and booking widgets; and integrated custom on-course photography and drone videography for an immersive experience.',
  },
  {
    id: 'christians',
    title: "Christians Healthcare Center — Volunteer Golf Instructor",
    date: '2023-Present',
    tag: 'Community',
    description:
      "Instruct seniors in golf lessons & simulator sessions, cultivating an interactive & enjoyable learning atmosphere for 1-2 hours per session.",
  },
  {
    id: 'monmouth',
    title: 'Monmouth University — Student',
    date: '2023-Present',
    tag: 'Graphic Design',
    description:
      'Enrolled at Monmouth University in West Long Branch, NJ. Graphic Design Major with a specialization in interactivity.',
  },
  {
    id: 'packanack-webmgr',
    title: 'Packanack Golf Club — Club Web Manager & Assistant',
    date: '2022-Present',
    tag: 'Web Ops',
    description:
      'Responsible for opening and closing the golf shop for over four years, ensuring smooth daily operations as well as maintaining & enhancing the golf course website.',
  },
  {
    id: 'rsp',
    title: 'RSP Media — Apprentice',
    date: '2019-2023',
    tag: 'Photo & Layout',
    description:
      'Assisted with photography, color balancing, and editing images for magazine layouts and product photography workflows.',
  },
]

const About = () => {
  usePageTitle('About')
  const { triggerHaptic } = useHaptic()
  const [openId, setOpenId] = useState<string | null>(null)

  const toggle = (id: string) => {
    triggerHaptic('click')
    setOpenId((cur) => (cur === id ? null : id))
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column about-page mb-6">
        {/* Available pill intentionally hidden on About page */}

        <motion.h1 
          className="text-5xl font-semibold text-accent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          About
        </motion.h1>
        <motion.h2 
          className="text-xl text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Hello — I'm Alexander (A.F.)
        </motion.h2>

        <motion.p 
          className="text-lg max-w-3xl mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          I'm a web and product designer who blends visual craft with front-end
          implementation. I study graphic design and interactivity, and I focus on
          UI systems, clear motion, and accessible experiences. I've worked on
          websites, apps, and brand systems for clients and personal projects since 2016.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <TiltCard>
            <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] h-full">
              <h3 className="text-sm text-[var(--muted)] mb-2">Based In</h3>
              <div className="text-lg font-semibold">Wayne, New Jersey</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] h-full">
              <h3 className="text-sm text-[var(--muted)] mb-2">Years</h3>
              <div className="text-lg font-semibold">8</div>
            </div>
          </TiltCard>

          <TiltCard>
            <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] h-full">
              <h3 className="text-sm text-[var(--muted)] mb-2">Projects</h3>
              <div className="text-lg font-semibold">{projects.length}{projects.length > 20 ? '+' : ''}</div>
            </div>
          </TiltCard>
        </motion.div>

  <div className="w-full h-[1px] my-6 border-t dotted-line" />

  <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-2xl font-semibold text-accent mb-4">Work & Experience</h3>

          <div className="space-y-4">
            {WORK.map((w) => {
              const isOpen = openId === w.id
              return (
                <TiltCard key={w.id} className="overflow-hidden">
                  <div className="rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
                    <button
                      type="button"
                      className="w-full text-left p-6 flex items-start justify-between gap-6"
                      onClick={() => toggle(w.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggle(w.id)
                        }
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`${w.id}-panel`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="text-lg font-semibold">{w.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-[var(--muted)] whitespace-nowrap mt-1">
                          <span>{w.date}</span>
                          <span className="opacity-40">•</span>
                          <span>{w.tag}</span>
                        </div>
                      </div>

                      <motion.span
                        animate={{ rotate: isOpen ? 90 : 0 }}
                        transition={{ duration: 0.18 }}
                        className="inline-block text-[var(--muted)] flex-shrink-0"
                      >
                        ▶
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={`${w.id}-panel`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-[var(--text)] leading-relaxed">{w.description}</p>
                            {w.tech && (
                              <div className="mt-4 text-sm text-[var(--muted)]">Tech: {w.tech}</div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </TiltCard>
              )
            })}
          </div>
        </motion.section>

  <div className="w-full h-[1px] my-6 border-t dotted-line" />

        <motion.section 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h4 className="text-[28px] text-accent font-semibold mb-4">My Stack</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 stack-grid w-full">
            {stackItems.map((item) => (
              <a
                key={item.name}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => triggerHaptic('click')}
                className="flex items-center gap-3 stack-item rounded-xl p-3 cursor-pointer"
              >
                <div className="stack-icon">
                  <img src={item.icon} alt={item.name} className="w-8 h-8" />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              </a>
            ))}
            </div>

          <div className="mt-6 w-full">
            <Link 
              to="/contact" 
              className="btn-primary w-full justify-center text-center"
              onMouseEnter={() => triggerHaptic('hover')}
              onClick={() => triggerHaptic('button')}
            >
              Get in Touch
            </Link>
          </div>
        </motion.section>
      </div>
    </motion.main>
  )
}

export default About
