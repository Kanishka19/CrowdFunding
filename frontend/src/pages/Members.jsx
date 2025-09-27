

  import React from "react";
  import Carousel from "react-multi-carousel";
  import "react-multi-carousel/lib/styles.css";
  import { motion } from "framer-motion";
  import { FiLinkedin } from "react-icons/fi";
  import { FiTwitter } from "react-icons/fi";
  import { GrInstagram } from "react-icons/gr";
  
  function OurMembers() {
    const members = [
        {
          name: "John Doe",
          designation: "President",
          description:
            "Leading with vision and passion to make impactful changes.",
          image: "https://plus.unsplash.com/premium_photo-1689977927774-401b12d137d6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8bWFufGVufDB8fDB8fHww",
        },
        {
          name: "Jane Smith",
          designation: "Vice President",
          description:
            "Ensuring smooth operations and supporting organizational growth.",
          image: "https://plus.unsplash.com/premium_photo-1681493353999-a3eea8b95e1d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8d29tZW58ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Emily Johnson",
          designation: "Treasurer",
          description:
            "Managing finances with precision to empower our initiatives.",
          image: "https://plus.unsplash.com/premium_photo-1679440415182-c362deb2fd40?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8d29tZW58ZW58MHx8MHx8fDA%3D",
        },
        {
          name: "Michael Brown",
          designation: "Secretary",
          description:
            "Keeping everything organized and fostering communication.",
          image: "https://plus.unsplash.com/premium_photo-1678197937465-bdbc4ed95815?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cGVyc29ufGVufDB8fDB8fHww",
        },
        {
          name: "Sarah Davis",
          designation: "Member at Large",
          description:
            "Bringing unique perspectives to drive innovative solutions.",
          image: "https://images.unsplash.com/photo-1703064690099-3058f8668460?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHdvbWVuJTIwZmFjZXxlbnwwfHwwfHx8MA%3D%3D",
        },
      ];
  
    const responsive = {
      superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 3,
      },
      desktop: {
        breakpoint: { max: 1024, min: 768 },
        items: 2,
      },
      tablet: {
        breakpoint: { max: 768, min: 464 },
        items: 1,
      },
      mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
      },
    };
  
    return (
      <div id="member" className="bg-gradient-to-b from-[#F5EFFF] to-[#EDE7FF] min-h-screen py-24">
        {/* Page Title */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-[#694F8E]">🎗️Our Members🎗️</h1>
          <p className="text-gray-600 mt-4">
            Meet the amazing individuals who drive our mission forward.
          </p>
        </div>
  
        {/* Members Carousel */}
        <div className="max-w-7xl mx-auto px-12">
          <Carousel responsive={responsive} infinite autoPlay autoPlaySpeed={3000}>
            {members.map((member, index) => (
              <motion.div
                key={index}
                className="overflow-hidden p-12 flex flex-col items-center text-center mx-2"
                whileHover={{ scale: 1.05 }}
              >
                {/* Image */}
                <motion.img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 rounded-full border-4 border-[#452275] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                />
  
                {/* Name */}
                <h2 className="text-3xl font-semibold text-[#694F8E] mb-2">
                  {member.name}
                </h2>
  
                {/* Designation */}
                <p className="text-[#452275] italic mb-4">{member.designation}</p>
                <div className="flex space-x-12 pb-4">
                <FiLinkedin/>
                <FiTwitter/>
                <GrInstagram/>
                </div>
                
                {/* Description */}
                <p className="text-[#b690e9]">{member.description}</p>
              </motion.div>
            ))}
          </Carousel>
        </div>
      </div>
    );
  }
  
  export default OurMembers;
  
