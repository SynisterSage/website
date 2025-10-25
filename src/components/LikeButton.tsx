import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleProjectLike, subscribeToProjectLikes, hasLikedProject } from '../lib/likesService';
import { useHaptic } from '../hooks/useHaptic';
import { gameAudio } from '../utils/gameAudio';

interface LikeButtonProps {
  projectId: string;
  className?: string;
}

export const LikeButton = ({ projectId, className = '' }: LikeButtonProps) => {
  const { triggerHaptic } = useHaptic();
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    // Check if user has liked this project
    setLiked(hasLikedProject(projectId));

    // Subscribe to real-time updates
    const unsubscribe = subscribeToProjectLikes(projectId, (newCount) => {
      setCount(newCount);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [projectId]);

  const handleLike = async () => {
    if (isAnimating) return;

    setIsAnimating(true);
    triggerHaptic('click');

    // Optimistic UI update
    const newLikedState = !liked;
    setLiked(newLikedState);
    // Play distinct UI sound for like/unlike (small, unobtrusive)
    try {
      if (newLikedState) {
        gameAudio.uiLike()
      } else {
        gameAudio.uiUnlike()
      }
    } catch {}
    
    if (newLikedState) {
      setShowParticles(true);
      setTimeout(() => setShowParticles(false), 600);
    }

    try {
      const result = await toggleProjectLike(projectId);
      setLiked(result.liked);
      // Count is updated via real-time subscription
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setLiked(liked);
    } finally {
      setTimeout(() => setIsAnimating(false), 300);
    }
  };

  return (
    <div className={`like-button-wrapper relative ${className}`}>
      <motion.button
        onClick={handleLike}
        disabled={isAnimating}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]
          shadow-[var(--glass-shadow-sm)] 
          transition-all duration-300
          hover:shadow-[var(--glass-shadow)] hover:scale-105
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          ${liked ? 'border-[var(--accent)]/30' : ''}
        `}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Heart Icon */}
        <motion.div
          animate={{
            scale: isAnimating ? [1, 1.3, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
          className="relative"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill={liked ? 'var(--accent)' : 'none'}
            stroke={liked ? 'var(--accent)' : 'currentColor'}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-all duration-300 ${liked ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>

          {/* Particle burst effect */}
          <AnimatePresence>
            {showParticles && (
              <>
                {[...Array(8)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{
                      opacity: 1,
                      scale: 0,
                      x: 0,
                      y: 0,
                    }}
                    animate={{
                      opacity: 0,
                      scale: [0, 1, 0],
                      x: Math.cos((i * Math.PI * 2) / 8) * 30,
                      y: Math.sin((i * Math.PI * 2) / 8) * 30,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="absolute top-1/2 left-1/2 w-1 h-1 rounded-full bg-[var(--accent)]"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  />
                ))}
              </>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Count with animated number */}
        <AnimatePresence mode="wait">
          <motion.span
            key={count}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={`
              text-sm font-semibold tabular-nums
              ${liked ? 'text-[var(--accent)]' : 'text-[var(--text)]'}
            `}
          >
            {count > 0 ? count : '0'}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Ripple effect on like */}
      <AnimatePresence>
        {isAnimating && liked && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 rounded-xl border-2 border-[var(--accent)] pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default LikeButton;
