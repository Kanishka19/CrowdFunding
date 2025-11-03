import React from 'react';
import { HashLink } from 'react-router-hash-link';
import { Home, Info, Mail, LogIn, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const RadialMenu = ({ isOpen, onClose }) => {
  const menuItems = [
    { id: 'home', icon: <Home size={24} />, label: 'Home' },
    { id: 'about', icon: <Info size={24} />, label: 'About' },
    { id: 'contact', icon: <Mail size={24} />, label: 'Contact' },
    { id: 'signup', icon: <UserPlus size={24} />, label: 'SignUp' },
    { id: 'login', icon: <LogIn size={24} />, label: 'LogIn' },
  ];

  const radius = 120; // px

  const menuVariants = {
    closed: { scale: 0, opacity: 0 },
    open: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 260, damping: 20 } },
  };

  const itemVariants = {
    closed: { scale: 0, opacity: 0 },
    open: { scale: 1, opacity: 1 },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-72 h-72"
            variants={menuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div 
              className="absolute inset-0 bg-gray-800 rounded-full opacity-50"
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            >
              <svg viewBox="0 0 200 200" className="w-full h-full">
                <path id="cog" d="M100,10 A 90,90 0 1,1 100,190 A 90,90 0 1,1 100,10 M100,30 A 70,70 0 1,0 100,170 A 70,70 0 1,0 100,30" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="20" />
              </svg>
            </motion.div>

            {menuItems.map((item, index) => {
              const angle = (index / menuItems.length) * 2 * Math.PI - Math.PI / 2;
              const x = radius * Math.cos(angle);
              const y = radius * Math.sin(angle);

              return (
                <HashLink
                  smooth
                  to={['signup', 'login'].includes(item.id) ? `/${item.id}` : `/#${item.id}`}
                  key={item.id}
                  className="absolute group w-20 h-20 flex items-center justify-center"
                  style={{
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                    top: '50%',
                    left: '50%',
                  }}
                  onClick={onClose}
                >
                  <motion.div
                    className="absolute inset-0 bg-purple-600 rounded-full flex items-center justify-center text-white cursor-pointer"
                    whileHover={{ scale: 1.2, backgroundColor: '#8b5cf6' }}
                    variants={itemVariants}
                    transition={{ delay: index * 0.05 }}
                  >
                    {item.icon}
                  </motion.div>
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
                      transform: 'scale(1.5) rotate(180deg) translateY(10px)',
                    }}
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 0.4 }}
                  >
                    <div className="w-full h-full bg-gradient-to-t from-purple-400 to-transparent"></div>
                  </motion.div>
                  <span className="absolute -bottom-6 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.label}</span>
                </HashLink>
              );
            })}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RadialMenu;
