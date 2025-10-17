import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import Media from '../components/Media'
import { useHaptic } from '../hooks/useHaptic'

const Home = () => {
  const { triggerHaptic } = useHaptic()
  
  // magnetic tilt for name: use local handlers (smoother via CSS transition)
  const nameRef = useRef<HTMLHeadingElement | null>(null)

  function handleNamePointerMove(e: React.PointerEvent<HTMLHeadingElement>) {
    const el = e.currentTarget
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) / rect.width
    const dy = (e.clientY - cy) / rect.height
    const rx = (-dy * 5).toFixed(2)
    const ry = (dx * 5).toFixed(2)
    el.style.transform = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`
  }

  function handleNamePointerLeave(e: React.PointerEvent<HTMLHeadingElement>) {
    const el = e.currentTarget
    // smooth reset
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }

  // One-time deobfuscation on first session visit: scramble -> reveal
  useEffect(() => {
    const key = 'nameDeobfuscated'
    const final = "Hey, I'm Alexander!"
    const el = nameRef.current
    if (!el) return
    if (sessionStorage.getItem(key) === '1') {
      el.textContent = final
      return
    }

    // scramble animation
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_-+=<>?/{}[]~1234567890"
    const duration = 900
    const start = performance.now()
    let raf = 0

    const frame = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const reveal = Math.floor(p * final.length)
      let out = ''
      for (let i = 0; i < final.length; i++) {
        if (i < reveal) out += final[i]
        else out += chars[Math.floor(Math.random() * chars.length)]
      }
      el.textContent = out
      if (p < 1) raf = requestAnimationFrame(frame)
      else {
        el.textContent = final
        try { sessionStorage.setItem(key, '1') } catch (e) { /* ignore */ }
      }
    }

    raf = requestAnimationFrame(frame)
    return () => cancelAnimationFrame(raf)
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column home-page mb-6">
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Link to="/contact" className="available-pill" onMouseEnter={() => triggerHaptic('hover')} onClick={() => triggerHaptic('click')}>
            <span className="available-dot" aria-hidden="true"><span className="dot-core" /></span>
            Available for Work
          </Link>
        </motion.div>

        <motion.h1
          ref={nameRef}
          className="text-5xl font-semibold text-accent mb-4 home-name"
          onPointerMove={handleNamePointerMove}
          onPointerLeave={handleNamePointerLeave}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* text content will be populated by effect (scramble -> reveal) */}
        </motion.h1>
        <motion.h2 
          className="text-xl text-gray-600 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          Web & Visual Designer
        </motion.h2>

        <motion.p 
          className="text-lg max-w-3xl mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          I've been designing brands and crafting digital experiences since 2016, while
          also studying graphic design and coding in college. This blend of creative and
          technical expertise shapes everything I create, ensuring each project is both
          visually engaging and functional.
        </motion.p>

        <motion.div 
          className="flex gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <Link 
            to="/contact" 
            className="btn-primary"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('button')}
          >
            Get in Touch
          </Link>
          <Link 
            to="/resume" 
            className="btn-secondary"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            View Resume
          </Link>
        </motion.div>

        <div className="w-full h-[1px] my-12 border-t dotted-line" />

  <motion.div 
          className="projects-header flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-[28px] text-accent font-semibold break-words">Selected Projects</h3>
          <Link 
            to="/projects" 
            title="All Projects" 
            className="btn-secondary self-end mt-4 sm:mt-0 whitespace-nowrap"
            onMouseEnter={() => triggerHaptic('hover')}
            onClick={() => triggerHaptic('click')}
          >
            All Projects
          </Link>
        </motion.div>

        <motion.div 
          className="projects-frame"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="grid gap-4">
            {projects.slice(0,4).map((p, idx) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className={`group block project-card-hover ${idx === 3 ? 'hidden-fourth' : ''}`}
                aria-label={`Open ${p.title} project`}
                data-prefetch-src={p.thumbnail}
                onMouseEnter={() => triggerHaptic('hover')}
                onClick={() => triggerHaptic('click')}
              >
                <div className="relative project-card mb-2">
                  <div className="w-full aspect-[16/9] md:aspect-[16/9] card-placeholder overflow-hidden">
                    {/* @ts-ignore */}
                    <Media src={p.thumbnail} alt={`${p.title} thumbnail`} />
                  </div>
                  {/* overlay badge spanning inside the card with balanced padding */}
                  <div className="absolute left-3 right-3 bottom-3">
                    <div className="project-badge glass-heavy">
                      <div className="text-sm font-medium">{p.title}</div>
                      <div className="text-xs text-gray-300">{p.categories.join(' • ')}</div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="w-full h-[1px] my-12 border-t dotted-line" />

        <motion.h4 
          className="text-[28px] text-accent font-semibold mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          My Stack
        </motion.h4>
        
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 stack-grid"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
        >
          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/framer.svg" alt="Framer" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Framer</div>
              <div className="text-sm text-gray-600">Web Design</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/figma.svg" alt="Figma" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Figma</div>
              <div className="text-sm text-gray-600">General Design</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/illustrator.svg" alt="Illustrator" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Illustrator</div>
              <div className="text-sm text-gray-600">Vector Management</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/photoshop.svg" alt="Photoshop" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Photoshop</div>
              <div className="text-sm text-gray-600">Photo Editing</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/vscode.svg" alt="VS Code" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">VS Code</div>
              <div className="text-sm text-gray-600">Backend Functions</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/shots.svg" alt="Shots" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Shots</div>
              <div className="text-sm text-gray-600">Mockup Creation</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/chatgpt.svg" alt="ChatGPT" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">ChatGPT</div>
              <div className="text-sm text-gray-600">Content Generation</div>
            </div>
          </div>

          <div className="flex items-center gap-3 stack-item rounded-xl p-3">
            <div className="stack-icon">
              <img src="/icons/slack.svg" alt="Slack" className="w-8 h-8" />
            </div>
            <div>
              <div className="font-medium">Slack</div>
              <div className="text-sm text-gray-600">Collaboration</div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.main>
  )
}

export default Home