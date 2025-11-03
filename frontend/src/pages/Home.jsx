import React, { useState, useEffect } from "react";
import bg2 from "../assets/bg2.jpg";
import { motion } from "framer-motion"; // For animation effects
import { tapSpring } from "../motionConfig";
import About from "./About";
import ContactUs from "./Contact";

const Home = () => {
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [heroOpacity, setHeroOpacity] = useState(1);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const fadePoint = 220; // start fade after 220px
      const o = Math.max(0, 1 - y / fadePoint);
      setHeroOpacity(o);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleMove = (e) => {
    setPointer({ x: e.clientX, y: e.clientY });
  };

  // derive tilt for vertical words
  const tiltAmount = 15;
  const centerX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
  const centerY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
  const dx = pointer.x - centerX;
  const dy = pointer.y - centerY;
  const tiltX = (dy / window.innerHeight) * tiltAmount;
  const tiltY = (dx / window.innerWidth) * tiltAmount;

  return (
    <>
      {/* Background Section */}
      <motion.div id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        style={{
          backgroundImage: `linear-gradient(rgba(30,20,50,0.35),rgba(30,20,50,0.55)),url(${bg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(1.5px)",
          zIndex: -1,
          position: "fixed",
          top: 0,
          left: 0,
        }}
        className="w-full h-screen overflow-hidden"
      />

      {/* Content Section */}
      <div onMouseMove={handleMove} className="relative flex flex-col items-start justify-center h-screen text-white font-serif pt-20 select-none">
        {/* /* Vertical "GIVE" text on the left */ }
        <motion.div
          className="absolute -left-[calc(1ch+1rem)] top-1/2 -translate-y-1/2 text-8xl font-bold text-[#ffff] z-10"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}
          initial={{ rotate: 90 }}
          animate={{ rotate: 90, rotateX: tiltX, rotateY: tiltY }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        >GIVE</motion.div>

        {/* /* Vertical "UNITY" text on the right */ }
        <motion.div
          className="absolute -right-[calc(1.65ch+1rem)] top-1/2 -translate-y-1/2 text-8xl font-bold text-[#ffff] z-10"
          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.35))' }}
          initial={{ rotate: -90 }}
          animate={{ rotate: -90, rotateX: -tiltX, rotateY: -tiltY }}
          transition={{ type: 'spring', stiffness: 60, damping: 15 }}
        >UNITY</motion.div>

        {/* Main Content */}
        <div className="z-10 pl-48 mx-12" style={{ opacity: heroOpacity }}>
          <motion.h1
            className="font-glyphic text-7xl text-[#ffff] tracking-tight"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9 }}
          >Small Acts, Big Impacts!</motion.h1>
          <motion.h3
            className="py-12 text-[#ffffff] text-xl max-w-xl leading-relaxed"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.4 }}
          >Empowering Communities, Changing Lives.</motion.h3>
          <motion.button
            {...tapSpring}
            className="relative bg-[#b897e5] hover:bg-[#ffff] text-[#382651] font-bold py-3 px-14 border-b-4 border-cyan-300 rounded shadow-lg shadow-purple-900/30 overflow-hidden group"
            whileHover={{ y: -2 }}
          >
            <span className="relative z-10">DONATE</span>
            {/* Ripple gradient */}
            <motion.span
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ opacity: [0, 0.55, 0.4] }}
              transition={{ duration: 0.9, ease: 'easeOut' }}
              style={{
                background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.45), rgba(255,255,255,0) 70%)'
              }}
            />
            <motion.span
              className="absolute -inset-10 opacity-0"
              initial={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1, opacity: 0.15 }}
              transition={{ type: 'spring', stiffness: 120, damping: 18 }}
              style={{ background: 'radial-gradient(circle at center, rgba(255,255,255,0.55), rgba(255,255,255,0) 65%)', filter: 'blur(22px)' }}
            />
          </motion.button>
        </div>
        {/* scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
            animate={{ opacity: heroOpacity < 0.15 ? 0 : 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs tracking-wider">SCROLL</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.8, repeat: Infinity }}
              className="w-1 h-8 bg-gradient-to-b from-white/80 to-white/10 rounded-full relative overflow-hidden"
            >
              <motion.span
                animate={{ y: [0, 14, 0] }}
                transition={{ duration: 1.8, repeat: Infinity }}
                className="absolute left-1/2 top-1 w-2 h-2 -translate-x-1/2 rounded-full bg-white"
              />
            </motion.div>
        </motion.div>
      </div>
      <div id="about">
        <About />
      </div>
      <div id="contact">
        <ContactUs />
      </div>
    </>
  );
};

export default Home;
