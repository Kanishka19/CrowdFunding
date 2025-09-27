import React from "react";

const About = () => {
  return (
    <div id="about" className="grid grid-cols-2 grid-rows-2 h-screen">
      {/* Top-left section with text */}
      <div className="flex items-center justify-center bg-white p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Make a Difference</h1>
          <p className="text-gray-600 pb-12">
            Join us in bringing positive change to the world through charity and volunteer work.
          </p>
          <button className="bg-[#583f92] text-white py-2 px-6 rounded-md hover:bg-[#b49be4] transition-colors duration-300">
            Find Campaign ✨    
          </button>
        </div>
      </div>

      {/* Top-right section with an image */}
      <div className="bg-gray-100">
        <img
          src="https://images.unsplash.com/photo-1526635090919-b5d79657c5a3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fG9sZCUyMGFnZSUyMGhvbWVzfGVufDB8fDB8fHww"
          alt="Charity"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-left section with an image */}
      <div className="bg-gray-100">
        <img
          src="https://plus.unsplash.com/premium_photo-1663090922495-1d99d1d77587?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2hlbHRlciUyMGhvbWUlMjBmb3IlMjBraWRzfGVufDB8fDB8fHww"
          alt="Volunteer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Bottom-right section with text */}
      <div className="flex items-center justify-center bg-white p-6 text-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Get Involved</h1>
          <p className="text-gray-600 pb-12">
            Your time and effort can help transform lives and build a better future for everyone.
          </p>
          <button className="bg-[#583f92] text-white py-2 px-6 rounded-md hover:bg-[#b49be4] transition-colors duration-300">
            Volunteer ✨
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
