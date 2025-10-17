import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import TiltCard from '../components/TiltCard'
import { useHaptic } from '../hooks/useHaptic'

type Service = {
  id: string
  title: string
  description: string
  price: string
  cta: string
}

const SERVICES: Service[] = [
  {
    id: 'product-design',
    title: 'Product Design',
    description:
      "I offer full-service product design, guiding you from initial research and brainstorming all the way to prototyping and the final design. Whether it's a digital product or physical interface, I focus on creating user-centered, innovative designs that deliver real results.",
    price: 'Starts at $800',
    cta: 'Get In Touch',
  },
  {
    id: 'web-design',
    title: 'Web Design',
    description:
      "As a specialist in web design, I create visually appealing, user-friendly websites that enhance your online presence. From layout and design to responsive functionality, I ensure your site looks great on all devices while delivering a seamless user experience. Whether you need a redesign or a brand-new site, I'll work closely with you to bring your vision to life.",
    price: 'Starts at $1500',
    cta: 'Get In Touch',
  },
  {
    id: 'web-development',
    title: 'Web Development',
    description:
      "I provide web development services focused on creating functional and dynamic websites tailored to your needs. From Framer sites, to fully functional electron applications with databases I can do it all. Whether it's building a new site or improving an existing one, I'm committed to bringing your vision to life.",
    price: 'Starts at $300',
    cta: 'Get In Touch',
  },
  {
    id: 'visual-design',
    title: 'Visual Design',
    description:
      "I offer a range of visual design services, including brand identity, digital graphics, collages, posters, and logos. My focus is on creating compelling visuals that effectively communicate your message and resonate with your audience. Whether you need a cohesive brand identity or eye-catching marketing materials, I'm dedicated to bringing your ideas to life.",
    price: 'Starts at $999',
    cta: 'Get Started',
  },
]

type FAQ = {
  id: string
  question: string
  answer: string
}

const FAQS: FAQ[] = [
  {
    id: 'what-services',
    question: 'What services do you offer?',
    answer:
      'I offer product design, web design, web development, and visual design services. Each service is tailored to meet your specific needs and goals.',
  },
  {
    id: 'approach',
    question: 'How do you approach a new design project?',
    answer:
      'I start with research and discovery to understand your goals, audience, and constraints. Then I move into ideation, prototyping, and iterative design, ensuring we validate decisions along the way.',
  },
  {
    id: 'redesign',
    question: 'Can you redesign my existing website or product?',
    answer:
      'Absolutely. I can audit your current design, identify pain points, and create a redesign that improves usability, aesthetics, and overall user experience.',
  },
  {
    id: 'timeline',
    question: 'How long does a typical design project take?',
    answer:
      'Timeline varies based on project scope. A simple website redesign might take 2-4 weeks, while a full product design can take 6-12 weeks. I will provide a detailed timeline during our initial consultation.',
  },
  {
    id: 'accessibility',
    question: 'How do you ensure the designs are user-friendly and accessible?',
    answer:
      'I follow best practices for accessibility (WCAG guidelines), conduct user testing, and focus on clear information architecture and intuitive navigation throughout the design process.',
  },
  {
    id: 'get-started',
    question: 'How can I get started with your services?',
    answer:
      'Simply reach out via the contact page with a brief description of your project. I will respond with next steps and we can schedule a consultation to discuss your needs in detail.',
  },
]

const Services = () => {
  const { triggerHaptic } = useHaptic()
  const [openId, setOpenId] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [needsReadMore, setNeedsReadMore] = useState<Record<string, boolean>>({})
  const descRefs = useRef<Record<string, HTMLParagraphElement | null>>({})

  const toggle = (id: string) => {
    triggerHaptic('click')
    setOpenId((cur) => (cur === id ? null : id))
  }
  const toggleExpand = (id: string) => {
    triggerHaptic('click')
    setExpandedId((cur) => (cur === id ? null : id))
  }

  // Check if text is truncated after mount and on resize
  useEffect(() => {
    const checkTruncation = () => {
      const newNeedsReadMore: Record<string, boolean> = {}
      
      SERVICES.forEach((service) => {
        const el = descRefs.current[service.id]
        if (el) {
          // Check if content is taller than the clamped height
          // scrollHeight > clientHeight means text is truncated
          newNeedsReadMore[service.id] = el.scrollHeight > el.clientHeight
        }
      })
      
      setNeedsReadMore(newNeedsReadMore)
    }

    // Check on mount
    checkTruncation()

    // Check on window resize
    window.addEventListener('resize', checkTruncation)
    return () => window.removeEventListener('resize', checkTruncation)
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column services-page mb-6">
        {/* Available pill intentionally hidden on Services page */}

        <motion.h1 
          className="text-5xl font-semibold text-accent mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          My Services
        </motion.h1>
        <motion.h2 
          className="text-xl text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          Curated offerings to bring your vision to life
        </motion.h2>

        <motion.p 
          className="text-lg max-w-3xl mb-6 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          I provide design and development services tailored to help individuals and teams ship meaningful products.
          Each offering is scoped to flex with your project size and goals.
        </motion.p>

  <div className="w-full h-[1px] my-6 border-t dotted-line" />

  <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {SERVICES.map((service) => {
              const isExpanded = expandedId === service.id
              const showReadMore = needsReadMore[service.id]
              
              return (
                <TiltCard key={service.id}>
                  <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] hover:border-[var(--accent)] transition-colors h-full flex flex-col">
                    <div>
                      <h3 className="text-2xl font-semibold text-accent mb-3">{service.title}</h3>
                    </div>

                    <div className="flex-1">
                      <p 
                        ref={(el) => { descRefs.current[service.id] = el }}
                        className={`text-[var(--text)] mb-4 leading-relaxed service-desc ${isExpanded ? 'expanded' : 'clamped'}`}
                      >
                        {service.description}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-6">
                      <span className="text-sm font-medium text-[var(--muted)] mb-3 sm:mb-0">{service.price}</span>
                      <div className="flex items-center gap-3 flex-wrap w-full">
                        {showReadMore && (
                          <button
                            type="button"
                            className="text-sm text-[var(--muted)] underline-offset-2 hover:underline"
                            onClick={() => toggleExpand(service.id)}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}

                        <Link 
                          to="/contact" 
                          className="btn-primary ml-auto"
                          onMouseEnter={() => triggerHaptic('hover')}
                          onClick={() => triggerHaptic('button')}
                        >
                          {service.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </TiltCard>
              )
            })}
          </div>
        </motion.section>

  <div className="w-full h-[1px] my-6 border-t dotted-line" />

  <motion.section 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-[28px] text-accent font-semibold mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            {FAQS.map((faq) => {
              const isOpen = openId === faq.id

              return (
                <div key={faq.id} className="rounded-2xl overflow-hidden">
                  <div className="bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
                    <button
                      type="button"
                      className="w-full text-left p-6 flex items-start justify-between gap-6"
                      onClick={() => toggle(faq.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault()
                          toggle(faq.id)
                        }
                      }}
                      aria-expanded={isOpen}
                      aria-controls={`${faq.id}-panel`}
                    >
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-lg">{faq.question}</h4>
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
                          id={`${faq.id}-panel`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.28 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6">
                            <p className="text-[var(--muted)] leading-relaxed">{faq.answer}</p>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.section>

        <div className="mt-8 w-full">
          <Link 
            to="/contact" 
            className="btn-primary w-full justify-center text-center"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('button')}
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </motion.main>
  )
}

export default Services
