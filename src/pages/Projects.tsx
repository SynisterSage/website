import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { useState, useMemo } from 'react'
import TiltCard from '../components/TiltCard'
import Media from '../components/Media'
import { useHaptic } from '../hooks/useHaptic'
import { usePageTitle } from '../hooks/usePageTitle'

const Projects = () => {
  usePageTitle('Projects')
  const { triggerHaptic } = useHaptic()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Extract all unique categories from projects
  const categories = useMemo(() => {
    const allCategories = projects.flatMap(project => project.categories)
    const uniqueCategories = Array.from(new Set(allCategories)).sort()
    return ['All', ...uniqueCategories]
  }, [])

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.categories.some(cat => cat.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === 'All' || project.categories.includes(selectedCategory)
    
    return matchesSearch && matchesCategory
  })

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
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
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

        {/* Category Filter - Horizontal Scroll */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <svg className="w-4 h-4 text-[var(--muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span className="text-sm font-medium text-[var(--muted)]">Filter by Category</span>
          </div>
          <div 
            className="project-category-scroll"
            onWheel={(e) => {
              e.preventDefault()
              e.stopPropagation()
              const container = e.currentTarget.querySelector('.project-category-filters')
              if (container) {
                container.scrollLeft += e.deltaY
              }
            }}
          >
            <div 
              className="project-category-filters"
              onMouseDown={(e) => {
                const container = e.currentTarget
                const startX = e.pageX - container.offsetLeft
                const scrollLeft = container.scrollLeft
                let isDragging = false

                const handleMouseMove = (e: MouseEvent) => {
                  isDragging = true
                  const x = e.pageX - container.offsetLeft
                  const walk = (x - startX) * 2
                  container.scrollLeft = scrollLeft - walk
                  container.style.cursor = 'grabbing'
                  container.style.userSelect = 'none'
                }

                const handleMouseUp = () => {
                  container.style.cursor = 'grab'
                  container.style.userSelect = 'auto'
                  document.removeEventListener('mousemove', handleMouseMove)
                  document.removeEventListener('mouseup', handleMouseUp)
                  
                  // Small delay to prevent click event if dragging
                  if (isDragging) {
                    setTimeout(() => { isDragging = false }, 50)
                  }
                }

                container.style.cursor = 'grabbing'
                document.addEventListener('mousemove', handleMouseMove)
                document.addEventListener('mouseup', handleMouseUp)
              }}
            >
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    triggerHaptic('click')
                    // Toggle behavior: clicking same category goes back to All
                    setSelectedCategory(selectedCategory === category ? 'All' : category)
                  }}
                  className={`project-category-pill ${selectedCategory === category ? 'active' : ''}`}
                >
                  {category}
                </button>
              ))}
            </div>
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