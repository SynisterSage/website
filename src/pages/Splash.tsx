import { useNavigate } from 'react-router-dom';
import ProgressBarLoader from '../components/ProgressBarLoader';
import { Suspense, useMemo } from 'react';
import { projects } from '../data/projects';
import { usePageTitle } from '../hooks/usePageTitle';

export default function Splash() {
  usePageTitle() // Use default site title
  const navigate = useNavigate();
  const assets = useMemo(() => {
    const urls = new Set<string>()
    for (const p of projects) {
      if (p.thumbnail) urls.add(p.thumbnail)
      if (Array.isArray(p.images)) {
        for (const img of p.images) {
          // skip videos
          if (/\.(mp4|webm|mov)$/i.test(img)) continue
          urls.add(img)
        }
      }
    }
    return Array.from(urls)
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <Suspense fallback={null}>
        <ProgressBarLoader
          duration={3500}
          assets={assets}
          onComplete={() => {
            try {
              sessionStorage.setItem('splashShown', '1')
            } catch (e) {
              /* ignore */
            }
            setTimeout(() => navigate('/', { replace: true }), 120);
          }}
        />
      </Suspense>
    </div>
  );
}
