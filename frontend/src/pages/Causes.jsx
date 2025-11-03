import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import Donate from "./Donate";

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
        <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800 mb-3">
          <span className="text-[#5f4696]">Our</span> Causes That <br />
          <span className="bg-gradient-to-r from-[#5f4696] to-[#9E77ED] text-transparent bg-clip-text">
            Change Lives
          </span>
        </h1>

        <div className="h-[3px] w-24 bg-gradient-to-r from-[#9E77ED] to-[#7F56D9] mx-auto rounded-full mb-4"></div>
        <p className="text-lg text-gray-600 font-medium max-w-xl mx-auto">
          Every contribution counts. Join hands to bring smiles and hope 💟
        </p>
      </div>


      {/* Causes Grid */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {causes?.map((cause, index) => {
          const progress =
            (cause.donations.current / cause.donations.goal) * 100;

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={cause.image}
                  alt={cause.title}
                  className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-110"
                />
                {cause.category && (
                  <span className="absolute top-3 right-3 bg-[#7F56D9]/80 text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
                    {cause.category}
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col flex-1 p-6 text-center">
                <h3 className="text-lg font-semibold text-[#694F8E] mb-1">
                  {cause.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                  {cause.description}
                </p>

                {/* Donation Progress */}
                <div className="w-full mb-3">
                  <div className="flex justify-between text-sm text-gray-700 mb-1">
                    <span>₹{cause.donations.current.toLocaleString()}</span>
                    <span>₹{cause.donations.goal.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className="bg-gradient-to-r from-[#9E77ED] to-[#7F56D9] h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      transition={{ duration: 1 }}
                    />
                  </div>
                </div>

                {/* Progress Text */}
                <p className="text-sm font-medium text-[#694F8E] mb-4">
                  {getProgressLabel(progress)}
                </p>

                {/* Donate Button */}
                <div className="mt-auto">
                  <Donate
                    donatedto={cause.title}
                    className="w-full bg-gradient-to-r from-[#7F56D9] to-[#9E77ED] text-white font-semibold py-2 rounded-full shadow-md hover:opacity-90 transition-all"
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Causes;
