import React, { useState, useEffect } from "react";

const RandomNumbersWithLabels = () => {
  const [numbers, setNumbers] = useState(["30M", "$180M", "20M", "18000"]); // Initial numbers

  // Labels for the numbers
  const labels = [
    "Monthly Visitors",
    "Donations Received",
    "Volunteers Connected",
    "Lives Impacted",
  ];

  // Function to generate random numbers with the desired format
  const generateFormattedNumbers = () => {
    const randomMillion = () => `${Math.floor(Math.random() * 100)}M`; // Random numbers in millions
    const randomDollarMillion = () => `$${Math.floor(Math.random() * 200)}M`; // Random dollar values in millions
    const randomValue = () => `${Math.floor(Math.random() * 50)}M`; // General random millions
    const randomPlainNumber = () => `${Math.floor(Math.random() * 50000)}`; // Plain number

    return [randomMillion(), randomDollarMillion(), randomValue(), randomPlainNumber()];
  };

  useEffect(() => {
    // Update numbers every 2 seconds
    const interval = setInterval(() => {
      setNumbers(generateFormattedNumbers());
    }, 2000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div id="data" className="flex justify-around items-center h-auto bg-[#694F8E] text-gray-900 font-bold text-xl  shadow-md shadow-zinc-500 p-8 space-y-4">
      {numbers.map((number, index) => (
        <div key={index} className="flex flex-col items-center space-y-2">
          {/* Number Display */}
          <div className="flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-2xl shadow-slate-200 text-center">
            {number}
          </div>
          {/* Label Below the Number */}
          <span className="text-sm text-[#ffff]">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
};

export default RandomNumbersWithLabels;
