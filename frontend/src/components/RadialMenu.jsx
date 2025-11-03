import { HashLink } from 'react-router-hash-link';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Info, Mail, UserPlus, LogIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

// Utility to create arc path for each segment
function createArc(startAngleDeg, endAngleDeg, innerR, outerR, cx = 0, cy = 0) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const startOuterX = cx + outerR * Math.cos(toRad(startAngleDeg));
  const startOuterY = cy + outerR * Math.sin(toRad(startAngleDeg));
  const endOuterX = cx + outerR * Math.cos(toRad(endAngleDeg));
  const endOuterY = cy + outerR * Math.sin(toRad(endAngleDeg));
  const startInnerX = cx + innerR * Math.cos(toRad(endAngleDeg));
  const startInnerY = cy + innerR * Math.sin(toRad(endAngleDeg));
  const endInnerX = cx + innerR * Math.cos(toRad(startAngleDeg));
  const endInnerY = cy + innerR * Math.sin(toRad(startAngleDeg));
  const largeArc = endAngleDeg - startAngleDeg <= 180 ? 0 : 1;
  return `M ${startOuterX} ${startOuterY} A ${outerR} ${outerR} 0 ${largeArc} 1 ${endOuterX} ${endOuterY} L ${startInnerX} ${startInnerY} A ${innerR} ${innerR} 0 ${largeArc} 0 ${endInnerX} ${endInnerY} Z`;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Home', type: 'hash' },
  { id: 'about', icon: Info, label: 'About', type: 'hash' },
  { id: 'contact', icon: Mail, label: 'Contact', type: 'hash' },
  { id: 'signup', icon: UserPlus, label: 'SignUp', type: 'route' },
  { id: 'login', icon: LogIn, label: 'LogIn', type: 'route' },
];

const RadialMenu = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // Dimensions used for positioning relative to side button (button width = 80px, half visible)
  const containerSize = 360; // ring diameter
  const buttonWidth = 80;
  const centerShift = (containerSize / 2) - (buttonWidth / 2); // shift ring so its center aligns with button center
  const verticalOffset = -180; // move wheel center slightly upward
  const [hoveredId, setHoveredId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: -200, y: -200 });
  const menuRef = useRef(null);

  // Track mouse position for spotlight effect
  useEffect(() => {
    if (!isOpen) return;

    // Set initial position on open, then track subsequent moves.
    const setInitialPosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      // The initial position is set, now we can remove this specific listener
      // and let the main 'mousemove' handler take over.
      window.removeEventListener('mousemove', setInitialPosition);
    };

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    // Listen once to set the initial state, then the main listener takes over
    window.addEventListener('mousemove', setInitialPosition, { once: true });
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', setInitialPosition);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isOpen]);

  // Prevent background scroll & key navigation when menu is open
  useEffect(() => {
    if (!isOpen) return;
    const disableScroll = (e) => e.preventDefault();
    const disableKeys = (e) => {
      const keys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','PageUp','PageDown','Home','End'];
      if (keys.includes(e.code) || keys.includes(e.key)) e.preventDefault();
    };
    document.addEventListener('wheel', disableScroll, { passive: false });
    document.addEventListener('touchmove', disableScroll, { passive: false });
    document.addEventListener('keydown', disableKeys, { passive: false });
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('wheel', disableScroll);
      document.removeEventListener('touchmove', disableScroll);
      document.removeEventListener('keydown', disableKeys);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  const spotlightSize = 60;
  const spotlightFadeStart = 40;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={menuRef}
          className="fixed inset-0 z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          aria-modal="true"
          role="dialog"
        >
          {/* Spotlight overlay */}
          <motion.div
            className="absolute inset-0 bg-black"
            style={{
              maskImage: `radial-gradient(circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent ${spotlightFadeStart}px, black)`,
              WebkitMaskImage: `radial-gradient(circle ${spotlightSize}px at ${mousePosition.x}px ${mousePosition.y}px, transparent ${spotlightFadeStart}px, black)`,
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClose}
          />

          {/* Ring anchored to side button position (right middle) */}
          <motion.div
            className="absolute top-1/2 right-0 select-none"
            style={{ width: containerSize, height: containerSize, top: `calc(50% + ${verticalOffset}px)`, transform: 'translateY(-50%)' }}
            initial={{ scale: 0.4, opacity: 0, x: 20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.4, opacity: 0, x: 20 }}
            transition={{ type: 'spring', stiffness: 140, damping: 16 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              {menuItems.map((item, idx) => {
                const total = menuItems.length;
                const spreadDegrees = 180;
                const segmentAngle = spreadDegrees / total;
                const start = 90 + idx * segmentAngle;
                const end = start + segmentAngle;
                const midAngle = ((start + end) / 2) * (Math.PI / 180);
                const iconRadius = 140;
                const iconX = iconRadius * Math.cos(midAngle) + centerShift + containerSize / 2;
                const iconY = iconRadius * Math.sin(midAngle) + containerSize / 2;
                const Icon = item.icon;
                const linkTarget = item.type === 'hash' ? `/#${item.id}` : `/${item.id}`;
                const isHovered = hoveredId === item.id;

                return (
                  <motion.div
                    key={item.id}
                    className="absolute"
                    style={{
                      left: iconX,
                      top: iconY,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + idx * 0.05 }}
                  >
                    <HashLink
                      to={linkTarget}
                      smooth
                      onClick={(e) => {
                        // Special handling for Home: force navigation & scroll reset
                        if (item.id === 'home') {
                          e.preventDefault();
                          if (location.pathname !== '/') {
                            navigate('/');
                            // allow route change then scroll to top
                            requestAnimationFrame(() => {
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            });
                          } else {
                            // already on home: smooth scroll to top & optionally trigger a light refresh of animations
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                          onClose();
                          return;
                        }
                        onClose();
                      }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                      className="group relative w-16 h-16 flex items-center justify-center rounded-full"
                    >
                      <AnimatePresence>
                        {isHovered && (
                          <motion.div
                            className="absolute inset-0 bg-white rounded-full"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          />
                        )}
                      </AnimatePresence>
                      <Icon
                        size={28}
                        className={`relative transition-colors duration-200 ${
                          isHovered ? 'text-black' : 'text-white'
                        }`}
                      />
                      <span className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-2 py-1 text-xs font-semibold text-black opacity-0 shadow-md transition-opacity group-hover:opacity-100">
                        {item.label}
                      </span>
                    </HashLink>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;