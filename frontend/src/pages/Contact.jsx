import React, { useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const next = {};
    if (!formData.name.trim()) next.name = "Name is required";
    if (!formData.email.trim()) next.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Enter a valid email";
    if (!formData.message.trim()) next.message = "Message is required";
    else if (formData.message.length < 15) next.message = "Message should be at least 15 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setSubmitted(false);
    try {
      await axios.post("/api/contact", formData);
      setSubmitted(true);
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
    } catch (error) {
      setErrors(prev => ({ ...prev, global: "Failed to send. Please try again." }));
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const formVariants = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } },
  };

  const infoVariants = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: "spring", stiffness: 50 } },
  };

  const messageLimit = 500;
  const remaining = messageLimit - formData.message.length;

  return (
    <>
      <div id="contact" className="relative min-h-screen bg-[radial-gradient(circle_at_20%_20%,#f3e8ff,#ffffff_60%)]">
        {/* animated ambient shapes */}
        <motion.div className="pointer-events-none absolute -top-24 -left-28 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl" animate={{ opacity:[0.4,0.65,0.4], scale:[1,1.15,1] }} transition={{ duration: 14, repeat: Infinity }} />
        <motion.div className="pointer-events-none absolute bottom-0 right-0 w-80 h-80 rounded-full bg-pink-300/30 blur-3xl" animate={{ opacity:[0.35,0.55,0.35], scale:[1,1.2,1] }} transition={{ duration: 16, repeat: Infinity }} />
        {/* Hero Section */}
        <motion.div
          className="relative bg-gradient-to-r from-[#694F8E] to-[#e3bca0] text-white py-20 font-serif"
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-lg">
              We’re here to help. Reach out to us with any queries or
              suggestions!
            </p>
          </div>
        </motion.div>

        {/* Contact Form & Info Section */}
        <motion.div
          className="max-w-6xl mx-auto py-14 px-4 grid grid-cols-1 lg:grid-cols-2 gap-14"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Contact Form */}
          <motion.div
            className="relative bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl p-8 border border-purple-100 overflow-hidden"
            variants={formVariants}
          >
            <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,0.5))]" />
            <h2 className="text-2xl font-bold mb-6 text-[#694F8E]">
              Send a Message
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <FormField label="Your Name" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Jane Doe" variants={itemVariants} />
              <FormField label="Your Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.email} placeholder="you@example.com" variants={itemVariants} />
              <motion.div className="space-y-2" variants={itemVariants}>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <div className="relative group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    maxLength={messageLimit}
                    placeholder="Tell us how we can help..."
                    className="w-full resize-none rounded-xl border border-gray-300 bg-white/70 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 h-40 shadow-sm"
                    aria-invalid={!!errors.message}
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] text-gray-500">{remaining} left</div>
                  <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition bg-gradient-to-r from-purple-200/60 to-pink-200/60 blur-sm" />
                </div>
                {errors.message && <p className="text-xs text-red-600">{errors.message}</p>}
              </motion.div>
              {errors.global && <p className="text-xs text-red-600">{errors.global}</p>}
              <motion.button
                type="submit"
                disabled={loading}
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: loading ? 1 : 1.03 }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-600/30 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send Message'}
              </motion.button>
              <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity:0, y:10 }}
                    animate={{ opacity:1, y:0 }}
                    exit={{ opacity:0, y:-10 }}
                    className="mt-2 flex items-center gap-2 text-xs font-medium text-green-600"
                  >
                    <span className="flex w-5 h-5 rounded-full bg-green-500 text-white text-[10px] items-center justify-center">✓</span>
                    Message received. We’ll reply soon.
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>

          {/* Contact Info with Background Image */}
          <motion.div
            className="relative bg-cover bg-center rounded-lg shadow-lg p-8 flex items-center justify-center text-center text-white"
            style={{
              backgroundImage: `linear-gradient(rgba(2, 2, 2, 0.8), rgba(227, 188, 160, 0.8)), url('https://images.unsplash.com/photo-1525450101819-1517c5c00f45?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
              minHeight: "350px",
            }}
            variants={infoVariants}
          >
            <motion.div variants={containerVariants}>
              <motion.h2 className="text-3xl font-bold mb-6" variants={itemVariants}>Contact Information</motion.h2>
              <motion.div className="flex items-center justify-center mb-4" variants={itemVariants}>
                <FaMapMarkerAlt className="text-2xl mr-4" />
                <p>123 Charity Street, City, State, 45678</p>
              </motion.div>
              <motion.div className="flex items-center justify-center mb-4" variants={itemVariants}>
                <FaPhoneAlt className="text-2xl mr-4" />
                <p>(123) 456-7890</p>
              </motion.div>
              <motion.div className="flex items-center justify-center" variants={itemVariants}>
                <FaEnvelope className="text-2xl mr-4" />
                <p>support@charity.com</p>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Map section retained but visually softened */}
        <motion.div
          className="max-w-6xl mx-auto py-16 px-4"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-100/70 to-pink-100/60 pointer-events-none" />
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.9299963720047!2d77.20902161511062!3d28.613939982495184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01ccfbb8f51f%3A0x218d7e3f3f1d25b!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1690489086374!5m2!1sen!2sin"
              className="w-full h-56 md:h-72 mix-blend-multiply"
              loading="lazy"
              allowFullScreen
              title="Google Map Location"
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

// Reusable field component
const FormField = ({ label, name, value, onChange, error, placeholder, type = 'text', variants }) => (
  <motion.div className="space-y-2" variants={variants}>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="relative group">
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-white/70 backdrop-blur-sm px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 shadow-sm ${error ? 'border-red-500' : 'border-gray-300'}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      <div className="absolute -inset-px rounded-2xl pointer-events-none opacity-0 group-focus-within:opacity-100 transition bg-gradient-to-r from-purple-200/60 to-pink-200/60 blur-sm" />
    </div>
    {error && <p id={`${name}-error`} className="text-xs text-red-600">{error}</p>}
  </motion.div>
);

export default ContactUs;
