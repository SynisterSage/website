import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '../hooks/useHaptic';

interface ShareButtonProps {
  projectTitle: string;
  projectId: string;
  className?: string;
}

export const ShareButton = ({ projectTitle, projectId, className = '' }: ShareButtonProps) => {
  const { triggerHaptic } = useHaptic();
  const [showMenu, setShowMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const projectUrl = `${window.location.origin}/projects/${projectId}`;
  const shareText = `Check out ${projectTitle} on my portfolio!`;

  // Check if native share is available (mobile/tablet)
  const canUseNativeShare = typeof navigator !== 'undefined' && navigator.share;

  const handleShare = async () => {
    triggerHaptic('click');

    if (canUseNativeShare) {
      try {
        await navigator.share({
          title: projectTitle,
          text: shareText,
          url: projectUrl,
        });
      } catch (error) {
        // User cancelled or error occurred
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
        }
      }
    } else {
      // Desktop: show custom menu
      setShowMenu(!showMenu);
    }
  };

  const copyToClipboard = async () => {
    triggerHaptic('click');
    try {
      await navigator.clipboard.writeText(projectUrl);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        setShowMenu(false);
      }, 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const shareToSocial = (platform: string) => {
    triggerHaptic('click');
    const encodedUrl = encodeURIComponent(projectUrl);
    const encodedText = encodeURIComponent(shareText);

    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      email: `mailto:?subject=${encodeURIComponent(projectTitle)}&body=${encodedText}%0A%0A${encodedUrl}`,
    };

    if (urls[platform]) {
      window.open(urls[platform], '_blank', 'noopener,noreferrer,width=600,height=400');
      setShowMenu(false);
    }
  };

  return (
    <div className={`share-button-wrapper relative ${className}`}>
      <motion.button
        onClick={handleShare}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-xl
          bg-[var(--glass-bg)] backdrop-blur-xl border border-[var(--glass-border)]
          shadow-[var(--glass-shadow-sm)] 
          transition-all duration-300
          hover:shadow-[var(--glass-shadow)] hover:scale-105
          active:scale-95
          ${showMenu ? 'border-[var(--accent)]/30' : ''}
        `}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Share Icon */}
        <motion.div
          animate={{
            rotate: showMenu ? 15 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-[var(--text)]"
          >
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
          </svg>
        </motion.div>

        <span className="text-sm font-semibold text-[var(--text)]">
          Share
        </span>
      </motion.button>

      {/* Desktop Share Menu */}
      <AnimatePresence>
        {showMenu && !canUseNativeShare && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setShowMenu(false)}
            />

            {/* Share Menu */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full mt-2 right-0 z-50 min-w-[240px] p-2 rounded-2xl bg-[var(--glass-bg-heavy)] backdrop-blur-xl border border-[var(--glass-border)] shadow-[var(--glass-shadow-heavy)]"
            >
              {/* Copy Link */}
              <motion.button
                onClick={copyToClipboard}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  {copied ? (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="var(--accent)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm font-medium ${copied ? 'text-[var(--accent)]' : 'text-[var(--text)]'}`}>
                  {copied ? 'Copied!' : 'Copy Link'}
                </span>
              </motion.button>

              <div className="h-px my-2 bg-[var(--glass-border)]" />

              {/* Social Share Options */}
              <motion.button
                onClick={() => shareToSocial('twitter')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                <span className="text-sm font-medium text-[var(--text)]">Share on X</span>
              </motion.button>

              <motion.button
                onClick={() => shareToSocial('linkedin')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <span className="text-sm font-medium text-[var(--text)]">Share on LinkedIn</span>
              </motion.button>

              <motion.button
                onClick={() => shareToSocial('facebook')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-[var(--text)]">Share on Facebook</span>
              </motion.button>

              <div className="h-px my-2 bg-[var(--glass-border)]" />

              <motion.button
                onClick={() => shareToSocial('email')}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                whileHover={{ x: 4 }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <span className="text-sm font-medium text-[var(--text)]">Share via Email</span>
              </motion.button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShareButton;
