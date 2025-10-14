import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useState } from 'react'
import TiltCard from '../components/TiltCard'
import Media from '../components/Media'
import { useHaptic } from '../hooks/useHaptic'

const Projects = () => {
  const { triggerHaptic } = useHaptic()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredProjects = projects.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column projects-page mb-6">
        <motion.h1 
          className="text-5xl font-bold mb-6 text-accent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recent Projects
        </motion.h1>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search Projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-transparent border border-[var(--border)] text-[var(--text)] placeholder-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
            />
            <svg 
              className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--muted)]"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </motion.div>

        <div className="w-full h-[1px] my-12 border-t dotted-line" />

        {/* Projects Grid - Large Cards (use projects-frame so css sizing rules apply like home) */}
        <div className="projects-frame">
          <div className="grid gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                <Link 
                  to={`/projects/${project.id}`} 
                  className="group block"
                  onMouseEnter={() => triggerHaptic('hover')}
                  onClick={() => triggerHaptic('click')}
                >
                  <TiltCard>
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] transition-all duration-500 hover:shadow-[var(--glass-shadow-heavy)] project-glass-hover">
                    {/* Image Container */}
                    <div className="w-full aspect-[16/9] md:aspect-[16/9] relative card-placeholder overflow-hidden">
                      {/* render thumbnail */}
                      <Media src={project.thumbnail} alt={`${project.title} thumbnail`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    </div>
                    
                    {/* Project Info Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <h3 className="text-3xl font-semibold text-white mb-2 transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-base text-gray-200">
                        {project.categories.join(' \u2022 ')}
                      </p>
                    </div>
                  </div>
                  </TiltCard>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* No Results Message */}
        {filteredProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-xl text-[var(--muted)]">No projects found matching "{searchQuery}"</p>
          </motion.div>
        )}
      </div>
    </motion.main>
  )
}

export default Projects