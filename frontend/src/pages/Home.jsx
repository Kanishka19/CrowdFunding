import React from "react";
import bg2 from "../assets/bg2.jpg";
import { motion } from "framer-motion"; // For animation effects

const Home = () => {
  return (
    <>
      {/* Background Section */}
      <div id="home"
        style={{
          backgroundImage: `url(${bg2})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(2px)",
          zIndex: -1,
          position: "fixed", // Fix position to viewport
          top: 0,
          left: 0,
        }}
        className="w-full h-screen overflow-hidden"
      ></div>

      {/* Content Section */}
      <div className="relative flex flex-col items-start justify-center h-screen text-white font-serif">
        {/* Vertical "GIVE" text on the left */}
        <div className="absolute left-[-100px] top-1/2 transform -translate-y-1/2 rotate-90 text-8xl font-bold text-[#ffff] z-10">
          GIVE
        </div>

        {/* Vertical "UNITY" text on the right */}
        <div className="absolute right-[-135px] top-1/2 transform -translate-y-1/2 rotate-90 text-8xl font-bold text-[#ffff] z-10">
          UNITY
        </div>

        {/* Main Content */}
        <div className="z-10 pl-48 mx-12">
          <motion.h1
            className="font-glyphic text-7xl text-[#ffff]"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Small Acts, Big Impacts!
          </motion.h1>

          <motion.h3
            className="py-12 text-[#ffffff] text-xl"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sed tenetur
          </motion.h3>
          <motion.button
            className="bg-[#b897e5] hover:bg-[#ffff] text-[#382651] font-bold py-2 px-12 border-b-4 border-cyan-300 rounded"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            DONATE
          </motion.button>
        </div>
      </div>
    </>
  );
};

export default Home;
