import React from "react";
import { useState } from "react";
import axios from "axios";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from "react-icons/fa";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("/api/contact", formData);
            alert("Message sent successfully!");
            setFormData({ name: "", email: "", message: "" }); 
        } catch (error) {
            console.error("Error sending message", error);
            alert("Failed to send message.");
        }
    }
    return (
        <div id="contact" className="bg-[#F5EFFF] min-h-screen">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-[#694F8E] to-[#e3bca0] text-white py-20 font-serif">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-lg">
                        We’re here to help. Reach out to us with any queries or suggestions!
                    </p>
                </div>
            </div>

            {/* Contact Form & Info Section */}
            <div className="max-w-6xl mx-auto py-10 px-4 grid grid-cols-1 md:grid-cols-2 gap-10">
                {/* Contact Form */}
                <div className="bg-white shadow-lg rounded-lg p-8">
                <h2 className="text-2xl font-bold mb-6 text-[#694F8E]">Send a Message</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Your Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Your Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694F8E]"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Message</label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Write your message here..."
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#694F8E] h-32"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-[#694F8E] text-white px-6 py-2 rounded-md hover:bg-[#572f6d] transition"
                    >
                        Send Message
                    </button>
                </form>
            </div>

                {/* Contact Info with Background Image */}
                <div
                    className="relative bg-cover bg-center rounded-lg shadow-lg p-8 flex items-center justify-center text-center text-white"
                    style={{
                        backgroundImage: `linear-gradient(rgba(2, 2, 2, 0.8), rgba(227, 188, 160, 0.8)), url('https://images.unsplash.com/photo-1525450101819-1517c5c00f45?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')`,
                        minHeight: "350px",
                    }}
                >
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Contact Information</h2>
                        <div className="flex items-center justify-center mb-4">
                            <FaMapMarkerAlt className="text-2xl mr-4" />
                            <p>123 Charity Street, City, State, 45678</p>
                        </div>
                        <div className="flex items-center justify-center mb-4">
                            <FaPhoneAlt className="text-2xl mr-4" />
                            <p>(123) 456-7890</p>
                        </div>
                        <div className="flex items-center justify-center">
                            <FaEnvelope className="text-2xl mr-4" />
                            <p>support@charity.com</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Google Map */}
            <div className="max-w-6xl mx-auto py-10 px-4">
                <h2 className="text-2xl font-bold mb-6 text-center text-[#694F8E]">Find Us Here</h2>
                <div className="overflow-hidden rounded-lg shadow-md">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3513.9299963720047!2d77.20902161511062!3d28.613939982495184!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d01ccfbb8f51f%3A0x218d7e3f3f1d25b!2sNew%20Delhi%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1690489086374!5m2!1sen!2sin"
                        className="w-full h-48 md:h-64"
                        loading="lazy"
                        allowFullScreen
                        title="Google Map Location"
                    />
                </div>
            </div>
        </div>
    );
}

export default ContactUs;
