import React, { useEffect, useState } from "react";
import { fetchBlogs, submitBlog } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext"; // <-- get logged-in user & logout

const segmentData = [
  { title: "Founders Journey", icon: "🚀" },
  { title: "Featured Story", icon: "🌟" },
  { title: "Latest Updates", icon: "📰" },
  { title: "Guides & Tips", icon: "💡" },
  { title: "Community Impact", icon: "🌍" },
  { title: "CallToAction", icon: "📣" },
];

function normalizeBlogs(raw) {
  const normalized = {};
  for (const { title } of segmentData) {
    const val = raw?.[title];
    if (Array.isArray(val)) {
      normalized[title] = val;
    } else if (val && typeof val === "object") {
      normalized[title] = [val];
    } else {
      normalized[title] = [];
    }
  }
  return normalized;
}

/* ---------- Inline SubmitBlogModal (self-contained) ---------- */
/* If you already have this component elsewhere, remove this and import it. */
const SubmitBlogModal = ({ open, onClose, onSubmit, user }) => {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [image, setImage] = React.useState(null);
  const [imagePreview, setImagePreview] = React.useState(null);
  const [summary, setSummary] = React.useState("");
  const [content, setContent] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null); // 'success', 'error', null
  const [statusMessage, setStatusMessage] = React.useState("");
  const [previewUrl, setPreviewUrl] = React.useState("");

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setCategory("");
      setImage(null);
      setImagePreview(null);
      setSummary("");
      setContent("");
      setSubmitting(false);
      setSubmitStatus(null);
      setStatusMessage("");
      setPreviewUrl("");
    }
  }, [open]);

  function handleImageChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target.result);
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      setSubmitStatus("error");
      setStatusMessage("Please provide a title and content.");
      return;
    }
    setSubmitting(true);
    setSubmitStatus(null);

    const payload = {
      title,
      category,
      summary,
      content,
      author: user?.fullname || user?.name || "Anonymous",
      email: user?.email,
    };

    console.log("📤 Submitting blog with user data:", {
      author: payload.author,
      email: payload.email,
      title: payload.title
    });

    try {
      const result = await onSubmit(payload, image);
      setSubmitStatus("success");
      setStatusMessage(result?.message || "Your story has been submitted successfully!");
      if (result?.previewUrl) {
        setPreviewUrl(result.previewUrl);
      }
      // Auto close after success animation
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
      setStatusMessage(err?.response?.data?.error || "Failed to submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10">
      {/* Animated background orbs matching login/signup */}
      <motion.div className="absolute -top-32 -left-28 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl" animate={{ scale: [1,1.15,1], opacity:[0.45,0.6,0.45] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -right-32 w-80 h-80 rounded-full bg-pink-300/30 blur-3xl" animate={{ scale: [1,1.2,1], opacity:[0.4,0.55,0.4] }} transition={{ duration: 14, repeat: Infinity }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-gradient-to-tr from-purple-200/20 via-pink-100/10 to-purple-300/20 blur-2xl" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
      
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#d8c7ff_0%,#f3e8ff_50%,rgba(0,0,0,0.6)_100%)] backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="relative z-60 w-full max-w-4xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl px-10 pt-10 pb-8 overflow-hidden"
      >
        {/* Glass morphism effect matching login/signup */}
        <div className="absolute inset-0 rounded-3xl pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,0.35))]" />
        
        {/* Header Section */}
        <div className="relative z-10 flex items-start justify-between gap-4 mb-8">
          <div className="flex-1">
            <motion.h2 
              initial={{ opacity:0, y:-15 }} 
              animate={{ opacity:1, y:0 }} 
              className="text-3xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text"
            >
              ✨ Share Your Story
            </motion.h2>
            <p className="text-gray-600 text-lg mb-4">Your experience matters — inspire the community</p>
            {user && (
              <div className="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl px-4 py-3 border border-purple-200/50">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {(user.fullname || user.name || "A")[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-semibold text-gray-700">{user.fullname || user.name || "Anonymous"}</div>
                  <div className="text-gray-500 text-sm">{user.email || "No email"}</div>
                </div>
              </div>
            )}
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-xl transition-all duration-200 hover:scale-110"
          >
            ×
          </button>
        </div>

        {/* Status Animation */}
        <AnimatePresence mode="wait">
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: -20 }}
              transition={{ duration: 0.5, type: "spring", damping: 15 }}
              className="relative z-10 mb-6"
            >
              {submitStatus === "success" ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 10 }}
                      className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <motion.svg
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        className="w-8 h-8 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </motion.svg>
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-green-700 mb-2"
                      >
                        🎉 Success!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-green-600"
                      >
                        {statusMessage}
                      </motion.p>
                      {previewUrl && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.6 }}
                          className="mt-3"
                        >
                          <a
                            href={previewUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-green-600 hover:text-green-700 underline"
                          >
                            🔗 View Email Preview
                          </a>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.7, duration: 3 }}
                    className="mt-4 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full origin-left"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-2xl p-6">
                  <div className="flex items-center gap-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: "spring", damping: 10 }}
                      className="w-16 h-16 bg-gradient-to-r from-red-500 to-rose-500 rounded-full flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ rotate: 0 }}
                        animate={{ rotate: 360 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        <X className="w-8 h-8 text-white" />
                      </motion.div>
                    </motion.div>
                    <div className="flex-1">
                      <motion.h3
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-xl font-bold text-red-700 mb-2"
                      >
                        ❌ Oops!
                      </motion.h3>
                      <motion.p
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-red-600"
                      >
                        {statusMessage}
                      </motion.p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Fields */}
        <div className="space-y-6 relative z-10">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Blog Title <span className="text-red-500">*</span>
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter a captivating title for your story..."
              className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              >
                <option value="">Select a category</option>
                {segmentData.map(({ title, icon }) => (
                  <option key={title} value={title}>
                    {icon} {title}
                  </option>
                ))}
              </select>
            </div>

            {/* Image Upload Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Feature Image
              </label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-sm file:bg-purple-600 file:text-white hover:file:bg-purple-700"
              />
              {imagePreview && (
                <div className="mt-3">
                  <img 
                    src={imagePreview} 
                    alt="preview" 
                    className="w-full h-32 object-cover rounded-xl border border-gray-200 shadow-sm" 
                  />
                </div>
              )}
            </div>
          </div>

          {/* Summary Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Short Summary
            </label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A compelling 1-2 sentence summary..."
              className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
            />
          </div>

          {/* Content Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Story <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Share your journey, experiences, challenges, and victories..."
              className="w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-200">
          <div className="text-xs text-gray-500">
            <span className="text-red-500">*</span> Required fields
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm text-gray-700 font-medium hover:border-purple-400 hover:shadow-md transition"
            >
              Cancel
            </button>

            <motion.button
              type="submit"
              disabled={submitting}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-purple-600/30 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25"/>
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" className="opacity-75"/>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Share My Story
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </motion.form>
    </div>
  );
};
/* ---------- end SubmitBlogModal ---------- */

const Blogs = () => {
  const [blogs, setBlogs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedSegment, setSelectedSegment] = useState("All");
  const [activeStory, setActiveStory] = useState(null);


  // modal state for Submit Blog
  const [submitOpen, setSubmitOpen] = useState(false);
  const { user } = useAuth(); // get logged-in user

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchBlogs(); // expects a dictionary: { "Founders Journey": [...], ... }
        setBlogs(normalizeBlogs(data));
      } catch (e) {
        setError("Failed to fetch blogs.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const allStories = Object.entries(blogs)
    .flatMap(([segment, stories]) =>
      (Array.isArray(stories) ? stories : []).map((s) => ({
        ...s,
        segment,
      }))
    )
    .filter((story) =>
      (story.title || "").toLowerCase().includes(search.toLowerCase())
    );

  const displayedStories =
    selectedSegment === "All"
      ? allStories
      : allStories.filter((s) => s.segment === selectedSegment);

  // Submit blog via email API
  async function handleSubmitBlog(payload, imageFile) {
    try {
      const result = await submitBlog(payload, imageFile);
      
      console.log("📧 Blog submission successful:", result);
      
      // Open preview URL in new tab if available
      if (result.previewUrl) {
        window.open(result.previewUrl, '_blank');
      }
      
      // Return the result for the modal to handle
      return {
        message: result.message || "Your story has been submitted successfully! The admin will review it soon.",
        previewUrl: result.previewUrl
      };
    } catch (err) {
      console.error("submit blog error", err);
      console.error("Full error details:", err.response?.data);
      
      // Throw the error for the modal to handle
      throw {
        response: {
          data: {
            error: err.response?.data?.error || "Failed to submit blog. Please try again."
          }
        }
      };
    }
  }

  return (
    <div className="bg-gradient-to-b from-[#f5e6ff] via-[#ece8ff] to-white min-h-screen relative">
      {/* HERO SECTION */}
      <section className="relative py-28 text-center overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://media.istockphoto.com/id/2223551599/photo/abstract-curved-lines-forming-a-subtle-striped-pattern-in-gradients-of-grey-and-light-blue.jpg?s=612x612&w=0&k=20&c=AKmJ9kN6aArvKJm9-zlV3PWj_0CufMx91Y9BV3-5O-8=)",
          }}
          aria-hidden="true"
        />

        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-white/70 via-white/40 to-white/80 backdrop-blur-[1px]" />

        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_#cbb2ff_0%,_#f5e6ff_60%,_transparent_100%)] pointer-events-none" />

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
          <p className="text-gray-700 text-lg mb-10">
            Real people. Real impact. Real stories. Explore journeys that inspire change.
          </p>

          {/* SEARCH BAR */}
          <div className="relative w-96 max-w-full mx-auto">
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

      {/* CTA FOOTER (opens submit modal) */}
      <section className="text-center py-20 bg-gradient-to-r from-[#b897e5]/30 to-[#f5e6ff]/30 mt-20 backdrop-blur-md rounded-t-3xl">
        <h2 className="text-4xl font-bold text-[#694F8E] mb-4">
          Want to Share Your Story?
        </h2>
        <p className="text-gray-600 mb-8">
          We love featuring inspiring journeys. Submit your story and join our community.
        </p>
        <button
          onClick={() => setSubmitOpen(true)}
          className="px-6 py-3 bg-[#694F8E] text-white font-semibold rounded-full hover:bg-[#563a70] transition-all"
        >
          Submit a Blog →
        </button>
      </section>



      {/* Submit Blog Modal */}
      <SubmitBlogModal
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        onSubmit={handleSubmitBlog}
        user={user}
      />
    </div>
  );
};

export default Blogs;