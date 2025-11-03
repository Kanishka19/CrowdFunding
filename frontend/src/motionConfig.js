// Centralized motion configuration and variants.
// Respects reduced motion preference.
import { useEffect, useState } from 'react';

export const useReducedMotionPref = () => {
  const [prefersReduced, setPrefersReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setPrefersReduced(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  return prefersReduced;
};

export const motionSettings = {
  ease: {
    out: [0.17, 0.84, 0.39, 1],
    inOut: [0.45, 0, 0.55, 1]
  },
  duration: {
    fast: 0.25,
    base: 0.45,
    slow: 0.9
  }
};

export const createPageVariants = (reduced = false) => {
  if (reduced) {
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 }
    };
  }
  return {
    initial: { opacity: 0, y: 24, scale: 0.985, filter: 'blur(4px)' },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: motionSettings.duration.base, ease: motionSettings.ease.out }
    },
    exit: {
      opacity: 0,
      y: -18,
      scale: 0.985,
      filter: 'blur(3px)',
      transition: { duration: motionSettings.duration.fast, ease: motionSettings.ease.inOut }
    }
  };
};

// Simple spring pop for interactive elements (buttons, etc.)
export const tapSpring = {
  whileTap: {
    scale: 0.94,
    transition: { type: 'spring', stiffness: 420, damping: 22 }
  },
  whileHover: {
    scale: 1.025,
    transition: { type: 'spring', stiffness: 260, damping: 18 }
  }
};
