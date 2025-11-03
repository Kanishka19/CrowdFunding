import { motion } from 'framer-motion';
import { useReducedMotionPref } from '../motionConfig';

// Animated ambient gradient backdrop.
// Sits behind all content; uses blend for depth.
const AmbientBackground = () => {
  const reduced = useReducedMotionPref();

  if (reduced) {
    return (
      <div
        aria-hidden="true"
        className="fixed inset-0 -z-10"
        style={{
          background: 'linear-gradient(135deg, #22172e 0%, #3b2a52 45%, #46334a 70%)'
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Base gradient layer */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 30% 40%, rgba(180,140,255,0.25), transparent 60%), radial-gradient(circle at 70% 65%, rgba(255,210,160,0.25), transparent 65%), linear-gradient(135deg,#1d1428,#352347 55%,#3d2c41)'
        }}
      />
      {/* Animated hue layer */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 mix-blend-screen opacity-70"
        initial={{ filter: 'hue-rotate(0deg)' }}
        animate={{ filter: ['hue-rotate(0deg)','hue-rotate(25deg)','hue-rotate(-10deg)','hue-rotate(0deg)'] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        style={{
          background: 'linear-gradient(120deg, rgba(105,79,142,0.35), rgba(255,210,160,0.25))'
        }}
      />
      {/* Soft vignette */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at center, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)'
        }}
      />
    </div>
  );
};

export default AmbientBackground;
