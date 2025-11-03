import { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logoss-bg-removed.png";
import RadialMenu from "../components/RadialMenu";
import { ChevronLeft } from 'lucide-react';

const Nav = () => {
  const [nav, setNav] = useState(false);
  const [showNav, setShowNav] = useState(true);
  const [navMode, setNavMode] = useState('bar'); // bar | transform | compact
  const transformTimeoutRef = useRef(null);
  const [isRadialMenuOpen, setIsRadialMenuOpen] = useState(false);
  const triggerRef = useRef(null);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);
  const [vh, setVh] = useState(typeof window !== 'undefined' ? window.innerHeight : 0);
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  useEffect(() => {
    // On auth pages keep nav in bar mode and visible (no transform behavior)
    if (isAuthPage) {
      setNavMode('bar');
      setShowNav(true);
      return; // skip attaching scroll listener logic
    }
    const handleResize = () => {
      setVw(window.innerWidth);
      setVh(window.innerHeight);
    };
    const handleScroll = () => {
      const scrollY = window.scrollY;
      if (scrollY === 0) {
        setShowNav(true);
        setNavMode('bar');
        if (transformTimeoutRef.current) clearTimeout(transformTimeoutRef.current);
        return;
      }
      setShowNav(false);
      const aboutEl = document.getElementById('about');
      const contactEl = document.getElementById('contact');
      const threshold = vh * 0.3;
      const nearSection = [aboutEl, contactEl].some(el => {
        if (!el) return false;
        const r = el.getBoundingClientRect();
        return r.top < threshold && r.bottom > threshold;
      });
      if (nearSection && navMode === 'bar') {
        setNavMode('transform');
        if (transformTimeoutRef.current) clearTimeout(transformTimeoutRef.current);
        // safety fallback if animation doesn't complete
        transformTimeoutRef.current = setTimeout(() => setNavMode('compact'), 1500);
      }
      if (!nearSection && navMode === 'compact' && scrollY < 140) {
        setNavMode('bar');
        setShowNav(true);
      }
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [navMode, vh, isAuthPage]);

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <>
      {navMode === 'bar' && (
        <div
          className={`bg-gradient-to-r from-[#694F8E]/70 to-[#8B7355]/70 backdrop-blur-sm flex justify-between items-center h-20 max-w-full mx-auto px-4 text-white ${isAuthPage ? 'relative' : 'fixed top-0 left-0 right-0'} z-50 hover:from-[#694F8E]/90 hover:to-[#8B7355]/90 transition-transform duration-500 shadow-lg shadow-black/20 ${showNav ? 'translate-y-0' : (isAuthPage ? '' : '-translate-y-full')}`}
        >
        <div>
          <img src={logo} alt="logo" className="h-16" />
        </div>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex items-center">
          <li className="p-4 font-glyphic">
            <HashLink
              smooth
              to="/#home"
              className="hover:text-[#e5cbb9] transition-colors duration-300"
              onClick={(e) => {
                if (location.pathname === '/' ) {
                  e.preventDefault();
                  // force a hard reload to reset all home state/animations
                  window.location.reload();
                }
              }}
            >Home</HashLink>
          </li>
          <li className="p-4 font-glyphic">
            <HashLink smooth to="/#about" className="hover:text-[#e5cbb9] transition-colors duration-300">About</HashLink>
          </li>
          <li className="p-4 font-glyphic">
            <HashLink smooth to="/#contact" className="hover:text-[#e5cbb9] transition-colors duration-300">Contact</HashLink>
          </li>
          <li className="ml-4">
            <Link to="/signup" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full transition-all duration-300">
              SignUp
            </Link>
          </li>
          <li className="ml-2">
            <Link to="/login" className="border border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded-full transition-all duration-300">
              LogIn
            </Link>
          </li>
        </ul>
        {/* Mobile Navigation Icon */}
        <div onClick={handleNav} className="block md:hidden">
          {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
        </div>

        {/* Mobile Navigation Menu */}
        <ul
          className={
            nav
              ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-gradient-to-b from-[#694F8E]/95 to-[#8B7355]/95 backdrop-blur-lg ease-in-out duration-500 z-40"
              : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
          }
        >
          {/* Mobile Logo */}
          <h1 className="w-full text-3xl font-bold text-[#e5cbb9] m-4">CrowdFund.</h1>

          {/* Mobile Navigation Items */}
          <li className="p-4 border-b border-gray-600">
            <HashLink
              smooth
              to="/#home"
              onClick={(e) => {
                if (location.pathname === '/') {
                  e.preventDefault();
                  window.location.reload();
                } else {
                  setNav(false);
                }
              }}
              className="font-glyphic hover:text-[#e5cbb9]"
            >Home</HashLink>
          </li>
          <li className="p-4 border-b border-gray-600">
            <HashLink smooth to="/#about" onClick={() => setNav(false)} className="font-glyphic hover:text-[#e5cbb9]">About</HashLink>
          </li>
          <li className="p-4 border-b border-gray-600">
            <HashLink smooth to="/#contact" onClick={() => setNav(false)} className="font-glyphic hover:text-[#e5cbb9]">Contact</HashLink>
          </li>
          <li className="p-4 border-b border-gray-600">
            <Link to="/signup" onClick={() => setNav(false)} className="font-glyphic hover:text-[#e5cbb9]">SignUp</Link>
          </li>
          <li className="p-4">
            <Link to="/login" onClick={() => setNav(false)} className="font-glyphic hover:text-[#e5cbb9]">LogIn</Link>
          </li>
        </ul>
      </div>
      )}

  {!isAuthPage && navMode === 'transform' && (
        <motion.div
          className="fixed top-0 left-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ width: vw, height: 80, x: 0, y: 0, borderRadius: 0, opacity: 1 }}
          animate={{
            width: [vw, vw * 0.55, 300, 200, 160],
            height: [80, 100, 180, 180, 160],
            // Curved path (sweeping downward arc then inward)
            x: [0, vw * 0.25, vw * 0.55, vw * 0.7, vw - 130],
            y: [0, vh * 0.12, vh * 0.30, vh * 0.42, vh * 0.5 - 80],
            borderRadius: [0, 24, 120, 140, 160],
            opacity: [1, 1, 0.97, 0.96, 0.95],
            background: [
              'linear-gradient(90deg, rgba(105,79,142,0.70), rgba(139,115,85,0.65))',
              'radial-gradient(circle at 40% 40%, rgba(180,140,255,0.55), rgba(105,79,142,0.60))',
              'radial-gradient(circle at 50% 50%, rgba(255,210,160,0.55), rgba(105,79,142,0.58))',
              'linear-gradient(135deg, rgba(105,79,142,0.88), rgba(139,115,85,0.86))',
              'linear-gradient(135deg, rgba(105,79,142,0.90), rgba(139,115,85,0.90))'
            ],
            boxShadow: [
              '0 0 0 rgba(0,0,0,0.22)',
              '0 10px 26px rgba(0,0,0,0.30)',
              '0 16px 46px rgba(105,79,142,0.55), 0 0 20px rgba(255,210,160,0.35)',
              '0 14px 38px rgba(105,79,142,0.50)',
              '0 18px 42px -8px rgba(105,79,142,0.55), 0 6px 18px rgba(0,0,0,0.25)'
            ],
            filter: ['brightness(1)', 'brightness(1.12)', 'brightness(1.21)', 'brightness(1.24)', 'brightness(1.18)'],
            scale: [1, 1.01, 1.025, 1.008, 1],
            rotate: [0, 3, 6, 4, 0]
          }}
          transition={{
            duration: 0.75,
            times: [0, 0.28, 0.55, 0.78, 1],
            ease: 'easeInOut'
          }}
          onAnimationComplete={() => setNavMode('compact')}
        >
          {/* comet trail layers */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.25,0.35,0.18,0.08,0] }}
            transition={{ duration: 0.75, times: [0,0.3,0.6,0.85,1] }}
            style={{
              background: 'radial-gradient(circle at 65% 60%, rgba(255,255,255,0.55), rgba(255,255,255,0) 70%)',
              filter: 'blur(22px)'
            }}
          />
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3,0.5,0.22,0.1,0] }}
            transition={{ duration: 0.75, times: [0,0.28,0.55,0.78,1] }}
            style={{
              background: 'radial-gradient(circle at 70% 55%, rgba(255,210,160,0.55), rgba(255,210,160,0) 70%)',
              filter: 'blur(34px)'
            }}
          />
          {/* faster logo fade */}
          <motion.div
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex items-center justify-center"
          >
            <img src={logo} alt="logo shrinking" className="h-12" />
          </motion.div>
          {/* subtle internal glow appears earlier */}
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.45 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.32), rgba(255,255,255,0) 70%)' }}
          />
        </motion.div>
      )}

  {!isAuthPage && navMode === 'compact' && (
        <button
          onClick={() => setIsRadialMenuOpen(prev => !prev)}
          aria-label={isRadialMenuOpen ? "Close radial menu" : "Open radial menu"}
          aria-expanded={isRadialMenuOpen}
          className="group fixed top-1/2 -translate-y-1/2 right-0 translate-x-1/2 w-20 h-20 rounded-full bg-purple-600/40 backdrop-blur-sm text-white shadow-lg shadow-purple-900/30 z-50 border border-purple-300/30 transition-colors duration-300 hover:bg-purple-600/70 focus:outline-none focus:ring-2 focus:ring-purple-300 overflow-hidden"
          ref={triggerRef}
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500/30 via-purple-600/20 to-purple-800/30 group-hover:from-purple-400/50 group-hover:via-purple-600/40 group-hover:to-purple-900/50 transition-colors" />
          <div className="relative flex items-center justify-center w-full h-full">
            <ChevronLeft size={30} className="transform group-hover:-translate-x-3 transition-all duration-400" />
          </div>
        </button>
      )}

      {!isAuthPage && <RadialMenu isOpen={isRadialMenuOpen} onClose={() => setIsRadialMenuOpen(false)} anchorRef={triggerRef} />}
    </>
  );
};

export default Nav;
