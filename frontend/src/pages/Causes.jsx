import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Donate from "./Donate";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  hover: {
    y: -8,
    transition: {
      duration: 0.3,
    },
  },
};

const imageVariants = {
  hover: {
    scale: 1.15,
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const progressVariants = {
  hidden: { width: 0 },
  visible: {
    width: "100%",
    transition: {
      duration: 1.2,
      ease: "easeInOut",
      delay: 0.3,
    },
  },
};

const badgeVariants = {
  hidden: { opacity: 0, scale: 0.8, x: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.4,
    },
  },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
    },
  },
  tap: {
    scale: 0.98,
  },
};

const dividerVariants = {
  hidden: { width: 0 },
  visible: {
    width: 96,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      delay: 0.4,
    },
  },
};

const Causes = () => {
  const [causes, setCauses] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get("/api/cause", {
        headers: { Accept: "application/json" },
      });
      setCauses(response.data);
    } catch (error) {
      console.error("Error fetching causes:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // progress-based message
  const getProgressLabel = (progress) => {
    if (progress < 20) return "Let's Begin 🚀";
    if (progress < 80) return "Halfway There ♦️";
    if (progress < 100) return "Approaching Goal 🎯";
    return "Goal Reached 🎉";
  };

  return (
    <section
      id="causes"
      className="relative py-24 px-6 lg:px-16 bg-gradient-to-b from-[#F5EFFF] via-[#EDE7FF] to-[#EADCFD] overflow-hidden"
    >
      {/* Background blur gradient */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-[600px] h-[600px] bg-gradient-to-tr from-[#d7b4ff] via-[#f5e1ff] to-[#ffe4f9] blur-[150px] opacity-50" />
      </div>

      {/* Heading */}
      <div className="text-center mb-20">
        <motion.h1
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-3"
        >
          <span className="text-[#5f4696]">Our</span> Causes That <br />
          <span className="bg-gradient-to-r from-[#5f4696] to-[#9E77ED] text-transparent bg-clip-text">
            Change Lives
          </span>
        </motion.h1>

        <motion.div
          variants={dividerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          className="h-[3px] bg-gradient-to-r from-[#9E77ED] to-[#7F56D9] mx-auto rounded-full mb-4"
        />
        <motion.p
          variants={headingVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, amount: 0.5 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-gray-600 font-medium max-w-xl mx-auto"
        >
          Every contribution counts. Join hands to bring smiles and hope 💟
        </motion.p>
      </div>


      {/* Causes Grid */}
      <motion.div
        className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.1 }}
      >
        {causes?.map((cause, index) => {
          const progress =
            (cause.donations.current / cause.donations.goal) * 100;

          return (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              whileHover="hover"
              viewport={{ once: false, amount: 0.3 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <motion.div className="relative h-48 w-full overflow-hidden">
                <motion.img
                  src={cause.image}
                  alt={cause.title}
                  className="w-full h-full object-cover"
                  variants={imageVariants}
                  whileHover="hover"
                  transition={{ duration: 0.4 }}
                />
                {cause.category && (
                  <motion.span
                    variants={badgeVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: false }}
                    className="absolute top-3 right-3 bg-[#7F56D9]/80 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm"
                  >
                    {cause.category}
                  </motion.span>
                )}
              </motion.div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 text-center">
                <motion.h3
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-lg font-semibold text-[#694F8E] mb-1"
                >
                  {cause.title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-600 mb-4 line-clamp-3"
                >
                  {cause.description}
                </motion.p>

                {/* Donation Progress */}
                <motion.div
                  className="w-full mb-3"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>₹{cause.donations.current.toLocaleString()}</span>
                    <span>₹{cause.donations.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#9E77ED] to-[#7F56D9] h-2 rounded-full"
                      variants={progressVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: false }}
                    />
                  </div>
                </motion.div>

                {/* Progress Text */}
                <motion.p
                  initial={{ opacity: 0, y: 5 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="text-sm font-medium text-[#694F8E] mb-4"
                >
                  {getProgressLabel(progress)}
                </motion.p>

                {/* Donate Button */}
                <motion.div
                  className="mt-auto"
                  variants={buttonVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: false }}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Donate
                    donatedto={cause.title}
                    className="w-full bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white font-semibold py-2 rounded-full shadow-md hover:opacity-90 transition-all"
                  />
                </motion.div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </section>
  );
};

export default Causes;