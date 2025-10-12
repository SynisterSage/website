import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'

const Projects = () => {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-24 px-6"
    >
      <div className="content-column">
        <motion.h1 
          className="text-4xl font-bold mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Recent Projects
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group"
          >
            <Link to={`/project/${project.id}`}>
              <div className="relative overflow-hidden rounded-lg">
                <img 
                  src={project.thumbnail} 
                  alt={project.title}
                  className="w-full aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
              </div>
              <h3 className="text-xl font-semibold mt-4 mb-2">{project.title}</h3>
              <p className="text-gray-600">{project.categories.join(' • ')}</p>
            </Link>
          </motion.div>
        ))}
        </div>
      </div>
    </motion.main>
  )
}

export default Projects