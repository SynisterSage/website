import { useEffect, useState } from 'react';
import { getAllProjectLikes } from '../lib/likesService';
import type { ProjectLikes } from '../lib/likesService';
import { projects } from '../data/projects';

/**
 * Admin component to view project likes
 * Can be added to a hidden admin page or development tools
 */
export const ProjectLikesAnalytics = () => {
  const [likes, setLikes] = useState<ProjectLikes[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLikes = async () => {
      try {
        const allLikes = await getAllProjectLikes();
        setLikes(allLikes);
      } catch (error) {
        console.error('Error fetching likes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLikes();
  }, []);

  if (loading) {
    return (
      <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
        <p className="text-[var(--muted)]">Loading likes data...</p>
      </div>
    );
  }

  // Create a map for quick lookup
  const likesMap = new Map(likes.map(l => [l.projectId, l.count]));
  
  // Merge with project data for complete information
  const projectsWithLikes = projects.map(project => ({
    ...project,
    likes: likesMap.get(project.id) || 0,
  })).sort((a, b) => b.likes - a.likes);

  const totalLikes = likes.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
          <h3 className="text-sm text-[var(--muted)] mb-1">Total Likes</h3>
          <p className="text-3xl font-bold text-[var(--accent)]">{totalLikes}</p>
        </div>
        <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
          <h3 className="text-sm text-[var(--muted)] mb-1">Projects with Likes</h3>
          <p className="text-3xl font-bold text-[var(--accent)]">{likes.length}</p>
        </div>
        <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
          <h3 className="text-sm text-[var(--muted)] mb-1">Avg Likes per Project</h3>
          <p className="text-3xl font-bold text-[var(--accent)]">
            {likes.length > 0 ? Math.round(totalLikes / likes.length) : 0}
          </p>
        </div>
      </div>

      {/* Project Likes Table */}
      <div className="p-6 rounded-2xl bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]">
        <h2 className="text-2xl font-bold text-[var(--text)] mb-4">Project Likes</h2>
        <div className="space-y-3">
          {projectsWithLikes.map((project, index) => (
            <div
              key={project.id}
              className="flex items-center justify-between p-4 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl font-bold text-[var(--muted)] w-8">
                  #{index + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--text)]">
                    {project.title}
                  </h3>
                  <p className="text-sm text-[var(--muted)]">
                    {project.categories.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill={project.likes > 0 ? 'var(--accent)' : 'none'}
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span className="text-xl font-bold text-[var(--accent)] tabular-nums min-w-[3ch] text-right">
                  {project.likes}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="p-6 rounded-2xl bg-[var(--glass-bg-light)] backdrop-blur-xl border border-[var(--glass-border)]">
        <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
          💡 Analytics Tips
        </h3>
        <ul className="text-sm text-[var(--muted)] space-y-1 list-disc list-inside">
          <li>Likes update in real-time across all users</li>
          <li>Data is stored in Firebase Firestore collection: <code className="px-1 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--accent)]">projectLikes</code></li>
          <li>Users can like without authentication (tracked via localStorage)</li>
          <li>Each user can like a project once</li>
        </ul>
      </div>
    </div>
  );
};

export default ProjectLikesAnalytics;
