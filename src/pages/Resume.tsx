import { Link } from 'react-router-dom'
import { useHaptic } from '../hooks/useHaptic'

const Resume = () => {
  const { triggerHaptic } = useHaptic()
  
  return (
    <main className="min-h-screen page-pad">
  <div className="content-column mb-6 resume-page">
        <h1 className="text-3xl font-bold text-accent mb-4">Resume</h1>
        <p className="mb-6 text-sm text-[var(--muted)]">Full resume (PDF). Use the controls below to download or view full screen.</p>

  <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--glass-shadow)] mb-6 resume-frame" style={{ height: '80vh' }}>
          <iframe
            className="resume-iframe"
            src="/icons/FINAL%20RESUME.pdf#zoom=page-width"
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </div>

        <div className="flex gap-4">
          <a 
            href="/icons/FINAL%20RESUME.pdf" 
            className="btn-primary" 
            download
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('button')}
          >
            Download PDF
          </a>
          <Link 
            to="/" 
            className="btn-secondary"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            Back Home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Resume
