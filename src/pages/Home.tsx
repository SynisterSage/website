import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const Home = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen page-pad"
    >
  <div className="content-column home-page mb-6">
        <div className="mb-6">
          <span className="available-pill">
            <span className="w-2 h-2 bg-green-400 rounded-full" /> Available for Work
          </span>
        </div>

        <h1 className="text-5xl font-semibold text-accent mb-4">
          Hey, I'm Alexander!
        </h1>
        <h2 className="text-xl text-gray-600 mb-6">Web & Visual Designer</h2>

        <p className="text-lg max-w-3xl mb-8">
          I've been designing brands and crafting digital experiences since 2016, while
          also studying graphic design and coding in college. This blend of creative and
          technical expertise shapes everything I create, ensuring each project is both
          visually engaging and functional.
        </p>

        <div className="flex gap-4">
          <Link to="/contact" className="btn-primary">Get in Touch</Link>
          <a href="#" className="btn-secondary">View Resume</a>
        </div>

        <div className="w-full h-[1px] my-12 border-t dotted-line" />

        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[28px] text-accent font-semibold">Selected Projects</h3>
          <Link to="/projects" className="btn-secondary">All Projects</Link>
        </div>

        <div className="projects-frame">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {projects.slice(0,4).map((p, idx) => (
              <Link
                key={p.id}
                to={`/projects/${p.id}`}
                className={`group block project-card-hover ${idx === 3 ? 'xl:hidden' : ''}`}
                aria-label={`Open ${p.title} project`}
                data-prefetch-src={p.thumbnail}
              >
                <div className="relative project-card mb-2">
                  <div className="w-full aspect-[16/9] md:aspect-[16/9] card-placeholder overflow-hidden">
                    {/* @ts-ignore */}
                    <img src={p.thumbnail} alt={`${p.title} thumbnail`} className="w-full h-full object-cover" loading="lazy" decoding="async" />
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
        </div>

        <div className="w-full h-[1px] my-12 border-t dotted-line" />

        <h4 className="text-[28px] text-accent font-semibold mb-4">My Stack</h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-6 stack-grid">
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
        </div>
      </div>
    </motion.main>
  )
}

export default Home