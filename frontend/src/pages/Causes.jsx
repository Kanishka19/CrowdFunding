import React, { useState, useEffect } from "react";
import axios from "axios";

const Causes = () => {
  const [causes, setCauses] = useState([]);

  const getData = async () => {
    try {
      const response = await axios.get("/api/cause", {
        headers: {
          Accept: "application/json",
        },
      });
      setCauses(response.data);
    } catch (error) {
      console.error("Error fetching causes:", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div
      id="causes"
      className="bg-gradient-to-b from-[#F5EFFF] to-[#EDE7FF] min-h-screen py-32"
    >
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-5xl text-center font-bold mb-12 text-[#694F8E] animate-fadeInDown">
          🎗️Our Causes🎗️
        </h1>

        {/* Grid layout instead of carousel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fadeInUp">
          {causes?.map((cause, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-xl transform hover:scale-105 hover:shadow-2xl transition-transform duration-300 ease-in-out p-4 flex flex-col items-center text-center"
            >
              {/* Image */}
              <div className="relative w-full h-[150px] mb-4 overflow-hidden rounded-md group">
                <img
                  src={cause.image}
                  alt={cause.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 ease-in-out"
                />
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-[#694F8E] mb-2">
                {cause.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">{cause.description}</p>

              {/* Donations */}
              <div className="w-full mb-4">
                <div className="flex items-center justify-between w-full mb-1">
                  <div className="text-sm text-gray-700">
                    ${cause.donations.current} raised of ${cause.donations.goal}
                  </div>
                  <div className="ml-2 text-red-500">💜</div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#694F8E] h-2 rounded-full"
                    style={{
                      width: `${
                        (cause.donations.current / cause.donations.goal) * 100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* Donate Button */}
              <button className="mt-auto bg-[#694F8E] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#563a70] transition-colors duration-300">
                Donate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Causes;
