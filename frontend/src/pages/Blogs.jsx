
import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../api";

const segmentTitles = [
  "Founders Journey",
  "Featured Story",
  "Latest Updates",
  "Guides & Tips",
  "Community Impact",
  "Call to Action",
];

const segmentGradients = [
  "from-[#b897e5] to-[#f5e6ff]",
  "from-[#f5e6ff] to-[#b897e5]",
  "from-[#b897e5] to-[#e7e7ff]",
  "from-[#e7e7ff] to-[#b897e5]",
  "from-[#b897e5] to-[#f5e6ff]",
  "from-[#f5e6ff] to-[#b897e5]",
];

// Removed unused avatar code

const Blogs = () => {
  const [blogs, setBlogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch blogs.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        {/* Animated hand loading indicator */}
        <div className="hand-loader">
          <div className="hand">
            <div className="finger"></div>
            <div className="finger"></div>
            <div className="finger"></div>
            <div className="finger"></div>
            <div className="palm"></div>
            <div className="thumb"></div>
          </div>
        </div>
        <span className="mt-8 text-xl text-[#694F8E] font-semibold">Loading blog posts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="text-xl text-red-500">{error}</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-20 px-4 bg-gradient-to-b from-[#f5e6ff] to-[#e7e7ff]">
      <h1 className="text-6xl text-center font-extrabold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-[#694F8E] via-[#b897e5] to-[#563a70] drop-shadow-lg animate-fadeInDown">
        Blog Posts
      </h1>
      <div className="max-w-6xl mx-auto space-y-16">
        {segmentTitles.map((segment, idx) => {
          const key = segment;
          const stories = blogs[key] || [];
          return (
            <div
              key={key}
              className={`rounded-3xl shadow-2xl p-10 bg-gradient-to-br ${segmentGradients[idx % segmentGradients.length]} animate-fadeInUp`}
            >
              <h2 className="text-4xl font-bold text-[#694F8E] mb-10 border-b-2 border-[#b897e5] pb-4">
                {segment}
              </h2>
              {stories.length === 0 ? (
                <div className="text-gray-400 italic">No stories available.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {stories.map((story, i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl shadow-xl p-8 flex flex-col gap-4 hover:scale-[1.03] hover:shadow-2xl transition-all duration-300 border border-[#f5e6ff]"
                    >
                      <h3 className="text-2xl font-bold text-[#694F8E] mb-2">{story.title}</h3>
                      <p className="text-gray-700 text-lg leading-relaxed font-serif">{story.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};


// Add the hand loading animation CSS
const style = document.createElement('style');
style.innerHTML = `
.hand-loader {
  margin-left: 80px;
}
.hand {
  --skin-color: #E4C560;
  --tap-speed: 0.6s;
  --tap-stagger: 0.1s;
  position: relative;
  width: 80px;
  height: 60px;
}
.hand:before {
  content: '';
  display: block;
  width: 180%;
  height: 75%;
  position: absolute;
  top: 70%;
  right: 20%;
  background-color: black;
  border-radius: 40px 10px;
  filter: blur(10px);
  opacity: 0.3;
}
.palm {
  display: block;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: var(--skin-color);
  border-radius: 10px 40px;
}
.thumb {
  position: absolute;
  width: 120%;
  height: 38px;
  background-color: var(--skin-color);
  bottom: -18%;
  right: 1%;
  transform-origin: calc(100% - 20px) 20px;
  transform: rotate(-20deg);
  border-radius: 30px 20px 20px 10px;
  border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  border-left: 2px solid rgba(0, 0, 0, 0.1);
}
.thumb:after {
  width: 20%;
  height: 60%;
  content: '';
  background-color: rgba(255, 255, 255, 0.3);
  position: absolute;
  bottom: -8%;
  left: 5px;
  border-radius: 60% 10% 10% 30%;
  border-right: 2px solid rgba(0, 0, 0, 0.05);
}
.finger {
  position: absolute;
  width: 80%;
  height: 35px;
  background-color: var(--skin-color);
  bottom: 32%;
  right: 64%;
  transform-origin: 100% 20px;
  animation-duration: calc(var(--tap-speed) * 2);
  animation-timing-function: ease-in-out;
  animation-iteration-count: infinite;
  transform: rotate(10deg);
}
.finger:before {
  content: '';
  position: absolute;
  width: 140%;
  height: 30px;
  background-color: var(--skin-color);
  bottom: 8%;
  right: 65%;
  transform-origin: calc(100% - 20px) 20px;
  transform: rotate(-60deg);
  border-radius: 20px;
}
.finger:nth-child(1) {
  animation-delay: 0;
  filter: brightness(70%);
  animation-name: tap-upper-1;
}
.finger:nth-child(2) {
  animation-delay: var(--tap-stagger);
  filter: brightness(80%);
  animation-name: tap-upper-2;
}
.finger:nth-child(3) {
  animation-delay: calc(var(--tap-stagger) * 2);
  filter: brightness(90%);
  animation-name: tap-upper-3;
}
.finger:nth-child(4) {
  animation-delay: calc(var(--tap-stagger) * 3);
  filter: brightness(100%);
  animation-name: tap-upper-4;
}
@keyframes tap-upper-1 {
  0%, 50%, 100% {
    transform: rotate(10deg) scale(0.4);
  }
  40% {
    transform: rotate(50deg) scale(0.4);
  }
}
@keyframes tap-upper-2 {
  0%, 50%, 100% {
    transform: rotate(10deg) scale(0.6);
  }
  40% {
    transform: rotate(50deg) scale(0.6);
  }
}
@keyframes tap-upper-3 {
  0%, 50%, 100% {
    transform: rotate(10deg) scale(0.8);
  }
  40% {
    transform: rotate(50deg) scale(0.8);
  }
}
@keyframes tap-upper-4 {
  0%, 50%, 100% {
    transform: rotate(10deg) scale(1);
  }
  40% {
    transform: rotate(50deg) scale(1);
  }
}
`;
if (typeof document !== 'undefined' && !document.getElementById('hand-loader-style')) {
  style.id = 'hand-loader-style';
  document.head.appendChild(style);
}

export default Blogs;
