import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, User, Mail } from "lucide-react";

const segmentData = [
  { title: "Founders Journey", icon: "🚀" },
  { title: "Featured Story", icon: "🌟" },
  { title: "Latest Updates", icon: "📰" },
  { title: "Guides & Tips", icon: "💡" },
  { title: "Community Impact", icon: "🌍" },
  { title: "Call to Action", icon: "📣" },
];

const Blogs = () => {
  const [blogs, setBlogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [activeStory, setActiveStory] = useState(null);
  const [showSubscribe, setShowSubscribe] = useState(false);

  useEffect(() => {
    fetchBlogs()
      .then((data) => {
        setBlogs(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch blogs.");
        setLoading(false);
      });
  }, []);

  const allStories = Object.entries(blogs)
    .flatMap(([segment, stories]) => stories.map((s) => ({ ...s, segment })))
    .filter((story) =>
      story.title?.toLowerCase().includes(search.toLowerCase())
    );

  const displayedStories =
    selectedSegment === "All"
      ? allStories
      : allStories.filter((s) => s.segment === selectedSegment);

  return (
    <div className="bg-gradient-to-b from-[#f5e6ff] via-[#ece8ff] to-white min-h-screen relative">
      {/* HERO SECTION */}
      <section className="relative py-28 text-center overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#cbb2ff_0%,_#f5e6ff_60%,_transparent_100%)]"></div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-white/40 backdrop-blur-md rounded-3xl shadow-lg px-10 py-14 border border-white/30"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#694F8E] via-[#b897e5] to-[#563a70] mb-5"
          >
            Discover Inspiring Stories
          </motion.h1>
          <p className="text-gray-600 text-lg mb-10">
            Real people. Real impact. Real stories. Explore journeys that inspire change.
          </p>

          {/* SEARCH BAR */}
          <div className="relative w-96 mx-auto">
            <Search className="absolute left-4 top-3.5 text-[#694F8E]/70" />
            <input
              type="text"
              placeholder="Search stories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-full border border-[#b897e5]/40 shadow-sm py-3 pl-11 pr-6 focus:ring-2 focus:ring-[#694F8E] outline-none transition-all"
            />
          </div>
        </motion.div>
      </section>

      {/* SEGMENT FILTERS */}
      <div className="flex overflow-x-auto px-6 gap-3 justify-center mb-10 scrollbar-hide">
        <button
          onClick={() => setSelectedSegment("All")}
          className={`px-5 py-2 whitespace-nowrap rounded-full border font-medium transition-all ${
            selectedSegment === "All"
              ? "bg-[#694F8E] text-white scale-105 shadow-md"
              : "bg-white text-[#694F8E] hover:bg-[#f5e6ff]"
          }`}
        >
          🌈 All
        </button>
        {segmentData.map(({ title, icon }) => (
          <button
            key={title}
            onClick={() => setSelectedSegment(title)}
            className={`px-5 py-2 whitespace-nowrap rounded-full border font-medium transition-all ${
              selectedSegment === title
                ? "bg-[#694F8E] text-white scale-105 shadow-md"
                : "bg-white text-[#694F8E] hover:bg-[#f5e6ff]"
            }`}
          >
            {icon} {title}
          </button>
        ))}
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-[#f5e6ff] rounded-2xl shadow-md"></div>
          ))}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="text-center text-red-500 text-lg font-semibold py-20">
          {error}
        </div>
      )}

      {/* BLOG CARDS */}
      {!loading && !error && (
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayedStories.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 italic py-16">
              <p>No stories found 🧐</p>
            </div>
          ) : (
            displayedStories.map((story, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.05 }}
                viewport={{ once: true }}
                className="bg-white/70 backdrop-blur-md border border-white/40 rounded-3xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
                onClick={() => setActiveStory(story)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={
                      story.image ||
                      `https://source.unsplash.com/random/600x400/?${story.segment}`
                    }
                    alt={story.title}
                    className="w-full h-48 object-cover transition-transform duration-500 hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-6 flex flex-col flex-grow justify-between">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="text-xs font-medium bg-[#f5e6ff] text-[#694F8E] px-3 py-1 rounded-full">
                        #{story.segment}
                      </span>
                      {(story.tags || []).map((tag, t) => (
                        <span
                          key={t}
                          className="text-xs font-medium bg-[#e7e7ff] text-[#694F8E] px-3 py-1 rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-bold text-[#694F8E] mb-2">
                      {story.title}
                    </h3>
                    <p className="text-gray-700 text-base leading-relaxed line-clamp-4">
                      {story.content}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-sm text-[#694F8E]/70">
                    <span className="flex items-center gap-2">
                      <User size={15} /> {story.author || "Anonymous"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} /> {story.readTime || "4 min read"}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* MODAL FOR FULL STORY */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden"
            >
              <div className="relative">
                <img
                  src={
                    activeStory.image ||
                    `https://source.unsplash.com/random/800x500/?${activeStory.segment}`
                  }
                  alt={activeStory.title}
                  className="w-full h-64 object-cover"
                />
                <button
                  onClick={() => setActiveStory(null)}
                  className="absolute top-4 right-4 bg-white/80 rounded-full p-2 hover:bg-white"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="p-8">
                <h2 className="text-3xl font-bold text-[#694F8E] mb-4">
                  {activeStory.title}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {activeStory.content}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA FOOTER */}
      <section className="text-center py-20 bg-gradient-to-r from-[#b897e5]/30 to-[#f5e6ff]/30 mt-20 backdrop-blur-md rounded-t-3xl">
        <h2 className="text-4xl font-bold text-[#694F8E] mb-4">
          Want to Share Your Story?
        </h2>
        <p className="text-gray-600 mb-8">
          We love featuring inspiring journeys. Submit your story and join our community.
        </p>
        <button className="px-6 py-3 bg-[#694F8E] text-white font-semibold rounded-full hover:bg-[#563a70] transition-all">
          Submit a Blog →
        </button>
      </section>

      {/* FLOATING SUBSCRIBE BUTTON */}
      <button
        onClick={() => setShowSubscribe(true)}
        className="fixed bottom-6 right-6 bg-[#694F8E] text-white rounded-full shadow-xl hover:scale-105 transition-all px-5 py-3 font-semibold z-50"
      >
        ✉️ Subscribe
      </button>

      {/* SUBSCRIBE MODAL */}
      <AnimatePresence>
        {showSubscribe && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md relative"
            >
              <button
                onClick={() => setShowSubscribe(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-black"
              >
                <X size={20} />
              </button>
              <h3 className="text-2xl font-bold text-[#694F8E] mb-4">
                Subscribe for Updates
              </h3>
              <p className="text-gray-600 mb-6">
                Get notified when new stories are published.
              </p>
              <div className="flex flex-col gap-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3 text-gray-400" />
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full border rounded-full py-3 pl-10 pr-4 focus:ring-2 focus:ring-[#694F8E] outline-none"
                  />
                </div>
                <button className="w-full bg-[#694F8E] text-white rounded-full py-3 font-semibold hover:bg-[#563a70] transition">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blogs;
