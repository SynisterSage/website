import { Link } from 'react-router-dom'

const Resume = () => {
  return (
    <main className="min-h-screen page-pad">
      <div className="content-column mb-6">
        <h1 className="text-3xl font-bold text-accent mb-4">Resume</h1>
        <p className="mb-6 text-sm text-[var(--muted)]">Full resume (PDF). Use the controls below to download or view full screen.</p>

        <div className="w-full rounded-2xl overflow-hidden border border-[var(--border)] shadow-[var(--glass-shadow)] mb-6" style={{ height: '80vh' }}>
          <iframe
            src="/icons/FINAL%20RESUME.pdf"
            title="Resume PDF"
            style={{ border: 0, width: '100%', height: '100%' }}
          />
        </div>

        <div className="flex gap-4">
          <a href="/icons/FINAL%20RESUME.pdf" className="btn-primary" download>Download PDF</a>
          <Link to="/" className="btn-secondary">Back Home</Link>
        </div>
      </div>
    </main>
  )
}

export default Resume
