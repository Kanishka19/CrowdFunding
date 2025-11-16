import React, { useEffect, useState } from "react";
import { fetchBlogs } from "../api";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Clock, User, Mail } from "lucide-react";
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

  React.useEffect(() => {
    if (!open) {
      setTitle("");
      setCategory("");
      setImage(null);
      setImagePreview(null);
      setSummary("");
      setContent("");
      setSubmitting(false);
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
      alert("Please provide a title and content.");
      return;
    }
    setSubmitting(true);

    const payload = {
      title,
      category,
      summary,
      content,
      author: user?.fullname || user?.name || "Anonymous",
      email: user?.email,
    };

    try {
      await onSubmit(payload, image); // parent handles actual upload
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <form
        onSubmit={handleSubmit}
        className="relative z-60 w-[92%] max-w-3xl bg-white/95 rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-semibold text-[#694F8E]">Share Your Story</h3>
            <p className="text-sm text-gray-500">Share your experience — inspire others.</p>
          </div>
          <div>
            <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm text-gray-600">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="A short, punchy title"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b897e5]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Category</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g. Education, Rescue, Community"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b897e5]"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600">Feature Image</label>
            <input type="file" accept="image/*" onChange={handleImageChange} className="mt-1" />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="mt-2 h-28 w-full object-cover rounded-md" />
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Short Summary</label>
            <input
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="A 1–2 sentence summary"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b897e5]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm text-gray-600">Full Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              placeholder="Write your story..."
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#b897e5]"
            />
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="px-5 py-2 rounded-full bg-[#694F8E] text-white font-semibold hover:bg-[#563a70] disabled:opacity-60"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
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
  const [showSubscribe, setShowSubscribe] = useState(false);

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

  // Replace this with your real API submit function.
  async function handleSubmitBlog(payload, imageFile) {
    // Example: create FormData and POST to /api/blogs
    try {
      const form = new FormData();
      form.append("title", payload.title);
      form.append("category", payload.category || "");
      form.append("summary", payload.summary || "");
      form.append("content", payload.content);
      form.append("author", payload.author || "");
      form.append("email", payload.email || "");
      if (imageFile) form.append("image", imageFile);

      // Use your API client / fetch wrapper. Example:
      // const res = await fetch('/api/blogs', { method: 'POST', body: form });
      // const result = await res.json();
      // return result;

      // Stub: simulate network
      await new Promise((r) => setTimeout(r, 900));

      // Optionally refetch blogs after successful submit:
      const newData = await fetchBlogs();
      setBlogs(normalizeBlogs(newData));
      return true;
    } catch (err) {
      console.error("submit blog error", err);
      throw err;
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

      {/* Floating Subscribe Button */}
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
