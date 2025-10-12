import { motion } from 'framer-motion'
import { Link, useParams, Navigate } from 'react-router-dom'
import { projects } from '../data/projects'

const ProjectDetail = () => {
  const { projectId } = useParams<{ projectId: string }>()
  const project = projects.find(p => p.id === projectId)

  if (!project) {
    return <Navigate to="/projects" replace />
  }

  // Get other projects for "View More" section
  const otherProjects = projects.filter(p => p.id !== project.id).slice(0, 3)

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
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6 p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]"
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
          {project.fullDescription ? (
            project.fullDescription.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-[var(--text)] mb-6 leading-relaxed">
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-[var(--text)] mb-6 leading-relaxed">
              {project.description}
            </p>
          )}
        </motion.div>

        {/* Image Gallery - Full Width */}
        {project.images && project.images.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6 mb-6"
          >
            {project.images.map((_, index) => (
              <div 
                key={index} 
                className="w-full rounded-2xl overflow-hidden bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 card-placeholder shadow-[var(--glass-shadow)]"
                style={{ height: '600px' }}
              />
            ))}
          </motion.div>
        )}

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

        {/* Divider */}
  <div className="w-full h-[1px] my-6 border-t dotted-line" />

  {/* View More Projects */}
        {otherProjects.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-accent">View More Projects</h2>
              <Link to="/projects" className="btn-secondary">
                All Projects
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherProjects.map((otherProject) => (
                <Link 
                  key={otherProject.id} 
                  to={`/projects/${otherProject.id}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)] shadow-[var(--glass-shadow)] transition-all duration-500 hover:shadow-[var(--glass-shadow-heavy)] hover:scale-[1.02]">
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent)]/5 card-placeholder" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />
                    </div>
                    
                    <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/80 via-black/50 to-transparent">
                      <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-[var(--accent)] transition-colors">
                        {otherProject.title}
                      </h3>
                      <p className="text-sm text-gray-200">
                        {otherProject.categories.join(' • ')}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </motion.main>
  )
}

export default ProjectDetail
