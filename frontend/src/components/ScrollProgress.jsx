import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotionPref, motionSettings } from '../motionConfig';

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const reduced = useReducedMotionPref();

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const scrolled = (window.scrollY || doc.scrollTop);
      const height = doc.scrollHeight - doc.clientHeight;
      const ratio = height > 0 ? scrolled / height : 0;
      setProgress(ratio);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[60] pointer-events-none">
      <motion.div
        aria-hidden="true"
        className="h-full bg-gradient-to-r from-fuchsia-400 via-violet-500 to-amber-400 rounded-r"
        style={{ width: `${Math.max(progress * 100, 0)}%` }}
        initial={{ width: 0 }}
        animate={{ width: `${Math.max(progress * 100, 0)}%` }}
        transition={{
          duration: reduced ? 0 : motionSettings.duration.fast,
          ease: reduced ? 'linear' : motionSettings.ease.out
        }}
      />
      {/* Glow overlay */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: progress > 0.02 ? 0.55 : 0 }}
        transition={{ duration: 0.4 }}
        style={{ background: 'linear-gradient(90deg, rgba(255,255,255,0.4), rgba(255,255,255,0))', filter: 'blur(6px)' }}
      />
    </div>
  );
};

export default ScrollProgress;
