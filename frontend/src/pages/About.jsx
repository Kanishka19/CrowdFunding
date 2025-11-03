import React from "react";
import { motion } from "framer-motion";
import { Users, ShieldCheck, HandHeart, Eye } from 'lucide-react';
import heartImage from "../assets/Heart.png";
import FoundersImage from "../assets/foundersImage.jpg";

const About = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  // small card component for values
  const ValueCard = ({ icon, title, text }) => (
    <motion.div
      whileHover={{ y: -4 }}
      className="group p-4 rounded-xl bg-white/70 backdrop-blur border border-purple-100 shadow-sm flex flex-col gap-2"
    >
      <div className="flex items-center gap-2 text-purple-700 font-medium text-sm">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-md">{icon}</span>
        {title}
      </div>
      <p className="text-xs text-gray-600 leading-relaxed">{text}</p>
    </motion.div>
  );


  return (
    <>
      {/* Who We Are (early-stage redesign) */}
      <motion.section
        className="px-6 md:px-16 py-20 relative overflow-hidden"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        {/* background accents */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50" />
        <div className="absolute -top-32 -left-24 w-72 h-72 rounded-full bg-purple-300/20 blur-3xl" />
        <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-pink-300/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          {/* Copy */}
          <motion.div variants={itemVariants} className="space-y-7">
            <h2 className="text-4xl font-bold leading-tight bg-gradient-to-r from-purple-600 via-indigo-600 to-pink-600 text-transparent bg-clip-text">
              Who We Are
            </h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              We’re building a transparent crowdfunding platform that helps people champion causes they care about. Our focus is simplicity, trust, and meaningful impact over noise.
            </p>
            <p className="text-gray-700 text-base leading-relaxed">
              Our tools are friendly and easy to use: start a fundraiser, give to one, and quickly see how it’s doing. Payments are safe, progress is clear, and every story is written in simple, human language.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <ValueCard icon={<Eye size={20} />} title="Transparency First" text="Clear fees, visible fund flow, real-time progress." />
              <ValueCard icon={<ShieldCheck size={20} />} title="Built for Trust" text="Secure handling, verification pipeline in progress." />
              <ValueCard icon={<Users size={20} />} title="Community Led" text="Shaped by creators, donors, early supporters." />
              <ValueCard icon={<HandHeart size={20} />} title="Human Design" text="Flows that reduce friction and decision fatigue." />
            </div>
          </motion.div>
          {/* Visual side */}
          <motion.div variants={imageVariants} className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-purple-200/40 via-pink-100/30 to-indigo-200/40 blur-xl" />
            <div className="relative rounded-3xl overflow-hidden shadow-xl ring-1 ring-purple-100/50">
              <img src={heartImage} alt="Collaborative heart" className="object-cover w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-800/40 via-purple-600/25 to-transparent mix-blend-multiply" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* Founders Note Section */}
      <motion.section
        className="py-16 px-6 md:px-16 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100"
        variants={sectionVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left side - Founder's Image */}
            <motion.div className="lg:w-1/3 flex justify-center" variants={imageVariants}>
              <div className="relative">
                <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-400 to-blue-500 p-1">
                  <img
                    src={FoundersImage}
                    alt="Founder"
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-6 py-2 rounded-full shadow-lg">
                  <p className="text-sm font-semibold text-gray-800">Founder & CEO</p>
                </div>
              </div>
            </motion.div>

            {/* Right side - Founder's Note */}
            <motion.div className="lg:w-2/3 space-y-6" variants={itemVariants}>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-gray-800 border-b-4 border-purple-500 inline-block pb-2">
                  A Note from Our Founder
                </h2>
              </div>

              <div className="space-y-6 text-gray-700">
                <p className="text-lg leading-relaxed italic">
                  "When I started this journey, I had a simple yet powerful vision: to create a platform where
                  <span className="font-semibold text-purple-600"> compassion meets action</span>, and where every
                  individual has the power to make a meaningful difference."
                </p>

                <p className="text-base leading-relaxed">
                  Today, our platform stands as a testament to what's possible when technology serves humanity.
                  With features like <span className="font-medium">real-time campaign tracking</span>,
                  <span className="font-medium"> secure payment processing</span>, and
                  <span className="font-medium"> transparent fund allocation</span>, we've built more than just
                  a crowdfunding platform—we've created a community of changemakers.
                </p>

                <p className="text-base leading-relaxed">
                  From our intuitive campaign creation tools to our comprehensive donor dashboard, every feature
                  has been crafted with one goal in mind: <span className="font-semibold text-blue-600">
                  making generosity effortless and impactful</span>. Whether you're supporting education,
                  healthcare, disaster relief, or social causes, our platform ensures your contribution reaches
                  where it's needed most.
                </p>

                <div className="bg-white/70 backdrop-blur-sm rounded-lg p-6 border-l-4 border-purple-500">
                  <p className="text-base leading-relaxed font-medium text-gray-800">
                    "Every donation, every campaign, every story shared on our platform represents hope in action.
                    Together, we're not just funding projects—we're funding dreams, healing communities, and
                    building a more compassionate world, one contribution at a time."
                  </p>
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <div className="flex flex-col">
                    <p className="font-bold text-xl text-gray-800 border-purple-500">Kanishka Yadav</p>
                    <p className="text-purple-600 font-medium ">Founder & CEO</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

    </>
  );
};

export default About;
