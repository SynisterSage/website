import { useNavigate } from 'react-router-dom';
import ProgressBarLoader from '../components/ProgressBarLoader';
import { Suspense } from 'react';

export default function Splash() {
  const navigate = useNavigate();

  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <Suspense fallback={null}>
        <ProgressBarLoader
          duration={3500}
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
