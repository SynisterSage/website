import { motion } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { projects } from '../data/projects'
import Media from '../components/Media'
import { useHaptic } from '../hooks/useHaptic'

const ProjectDetail = () => {
  const { triggerHaptic } = useHaptic()
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  const [expanded, setExpanded] = useState(false)
  const [failedSrcs, setFailedSrcs] = useState<Record<string, boolean>>({})
  const fullText = project.fullDescription ? project.fullDescription : project.description || ''
  const isLong = fullText.length > 350 || (project.fullDescription && project.fullDescription.split('\n\n').length > 1)

  // Get other projects for "View More" section
  // Strategy: first include projects that share a category with the current project (related),
  // then fill with recent projects by year. Always exclude the current project and keep order deterministic.
  const related = projects.filter(p => p.id !== project.id && p.categories.some(cat => project.categories.includes(cat)))
  // Keep original order for related; if not enough, fill from remaining projects sorted by year desc then title
  const includedIds = new Set(related.map(r => r.id))
  const remaining = projects
    .filter(p => p.id !== project.id && !includedIds.has(p.id))
    .sort((a, b) => {
      const ay = Number(a.year || 0)
      const by = Number(b.year || 0)
      if (by !== ay) return by - ay
      return a.title.localeCompare(b.title)
    })

  const otherProjects = [...related, ...remaining].slice(0, 3)

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column project-detail mb-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link 
            to="/projects" 
            className="inline-flex items-center gap-2 text-[var(--muted)] hover:text-[var(--accent)] transition-colors"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Projects
          </Link>
        </motion.div>

        {/* Project Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-6xl font-bold text-accent mb-8"
        >
          {project.title}
        </motion.h1>

        {/* Project Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="project-meta grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]"
        >
          {project.year && (
            <div>
              <h3 className="text-sm text-[var(--muted)] mb-1">Year</h3>
              <p className="text-lg font-semibold text-[var(--text)]">{project.year}</p>
            </div>
          )}
          {project.service && (
            <div>
              <h3 className="text-sm text-[var(--muted)] mb-1">Service</h3>
              <p className="text-lg font-semibold text-[var(--text)]">{project.service}</p>
            </div>
          )}
          <div>
            <h3 className="text-sm text-[var(--muted)] mb-1">Category</h3>
            <p className="text-lg font-semibold text-[var(--text)]">{project.categories.join(', ')}</p>
          </div>
          {project.tools && project.tools.length > 0 && (
            <div>
              <h3 className="text-sm text-[var(--muted)] mb-1">Tools</h3>
              <p className="text-lg font-semibold text-[var(--text)]">{project.tools.join(', ')}</p>
            </div>
          )}
        </motion.div>

        {/* Divider */}
  <div className="w-full h-[1px] my-6 border-t dotted-line" />

        {/* Project Description */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none mb-6"
        >
          {!expanded && isLong ? (
            <div>
              <p className="text-[var(--text)] mb-4 leading-relaxed service-desc clamped">{fullText}</p>
              <button
                className="text-sm text-[var(--muted)] underline-offset-2 hover:underline"
                onClick={() => {
                  triggerHaptic('click')
                  setExpanded(true)
                }}
              >
                Read more
              </button>
            </div>
          ) : (
            (project.fullDescription ? project.fullDescription.split('\n\n') : [project.description]).map((paragraph, index) => (
              <p key={index} className="text-[var(--text)] mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))
          )}
          {expanded && isLong && (
            <div>
              <button 
                className="text-sm text-[var(--muted)] underline-offset-2 hover:underline" 
                onClick={() => {
                  triggerHaptic('click')
                  setExpanded(false)
                }}
              >
                Show less
              </button>
            </div>
          )}
        </motion.div>

        {/* Image Gallery - Full Width (include thumbnail first, dedupe) */}
        {/* Assemble gallery in this order: main files (thumbnail + main) -> other images -> videos */}
        {(
          (project.thumbnail ? [project.thumbnail] : [])
        ).filter(Boolean).length > 0 || (project.images || []).length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-6"
          >
            {(() => {
              // Build gallery in a predictable order while avoiding duplicates
              const allImages = project.images || []
              const videosOnly = allImages.filter(p => /\.(mp4|webm|ogg)$/i.test(p))
              const otherImages = allImages.filter(p => /\.(jpe?g|png|gif|svg|webp|avif)$/i.test(p) && p !== project.thumbnail)

              // final ordered array: thumbnail (if present) -> otherImages -> videosOnly
              const ordered = Array.from(new Set([...(project.thumbnail ? [project.thumbnail] : []), ...otherImages, ...videosOnly]))
              // If there's exactly one image (thumbnail only, or single main), render it without a giant placeholder
              if (ordered.length === 1) {
                const src = ordered[0]
                return (
                  <div key={0} className="w-full rounded-2xl overflow-hidden shadow-[var(--glass-shadow)]">
                    <div className="w-full h-auto max-h-[800px]">
                      <Media
                        src={src}
                        alt={`${project.title} gallery`}
                        className="w-full h-full object-contain"
                        onError={() => setFailedSrcs(prev => ({ ...prev, [src]: true }))}
                      />
                    </div>
                  </div>
                )
              }

              // Filter out any sources that failed to load
              const filtered = ordered.filter(src => !failedSrcs[src])

              return filtered.map((src, index) => (
                <div
                  key={index}
                  className="w-full rounded-2xl overflow-hidden shadow-[var(--glass-shadow)]"
                  style={{ height: '600px' }}
                >
                  <Media
                    src={src}
                    alt={`${project.title} gallery ${index + 1}`}
                    onError={() => setFailedSrcs(prev => ({ ...prev, [src]: true }))}
                  />
                </div>
              ))
            })()}
          </motion.div>
        ) : null}

        {/* Figma Embed - Full Width */}
        {project.figmaEmbed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-6"
          >
            <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--glass-shadow)]" style={{ height: '600px' }}>
              <iframe
                src={project.figmaEmbed}
                style={{ border: 0, width: '100%', height: '100%' }}
                allowFullScreen
                title={`${project.title} Figma Prototype`}
              />
            </div>
          </motion.div>
        )}

        {/* Live Demo Embed (if project.link is provided) */}
        {project.link && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mb-6"
          >
            <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--glass-shadow)]" style={{ height: '600px' }}>
              <iframe
                src={project.link}
                style={{ border: 0, width: '100%', height: '100%' }}
                title={`${project.title} Live Demo`}
              />
            </div>
            <div className="mt-2 text-sm text-[var(--muted)]">
              If the demo doesn't load in the embed, <a href={project.link} target="_blank" rel="noopener noreferrer" className="underline">open it in a new tab</a>.
            </div>
          </motion.div>
        )}

        {/* Divider */}
  <div className="w-full h-[1px] my-6 border-t dotted-line" />

  {/* View More Projects */}
        {otherProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="projects-header flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
              <h2 className="text-3xl font-bold text-accent break-words">View More Projects</h2>
              <Link 
                to="/projects" 
                title="All Projects" 
                className="btn-secondary self-end mt-4 sm:mt-0 whitespace-nowrap"
                onMouseEnter={() => triggerHaptic('hover')}
                onClick={() => triggerHaptic('click')}
              >
                All Projects
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((otherProject) => {
                // choose thumbnail fallback chain
                const thumb = otherProject.thumbnail || (otherProject.images && otherProject.images[0]) || ''
                return (
                  <Link
                    key={otherProject.id}
                    to={`/projects/${otherProject.id}`}
                    className="group block"
                    data-prefetch-src={thumb}
                    onMouseEnter={() => triggerHaptic('hover')}
                    onClick={() => triggerHaptic('click')}
                  >
                    <div className="relative overflow-hidden rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] transition-all duration-500 hover:shadow-[var(--glass-shadow-heavy)] hover:scale-[1.02]">
                      <div className="relative aspect-[16/10] overflow-hidden">
                        {thumb ? (
                          <img src={thumb} alt={`${otherProject.title} thumbnail`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 card-placeholder" />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                      </div>

                      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                        <h3 className="text-lg font-semibold text-white mb-1 transition-colors">
                          {otherProject.title}
                        </h3>
                        <p className="text-sm text-gray-200">
                          {otherProject.categories.join(' • ')}
                        </p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </motion.section>
        )}
      </div>
    </motion.main>
  )
}

export default ProjectDetail
