import React from 'react'
import logo from "../assets/logoss.png"
import { FaSquareFacebook } from "react-icons/fa6";
import { FaTwitter, FaInstagram, FaLinkedin} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#000000] text-white py-10">
      <div className="max-w-6xl mx-auto px-8">
        {/* Footer Grid */}
        <div className="flex justify-between">
          {/* Logo and Description */}
          <div>
            {/* Logo */}
            <div className="mb-4">
              <img src={logo} alt="Website Logo" className="w-20" />
            </div>
            {/* Description */}
            <div>
              <p className="text-lg font-semibold">
                Empowering Communities, Changing Lives.
              </p>
              <p className="text-sm py-2">
                Join us in making a difference with every contribution you make.
              </p>
            </div>
             {/* Social Media */}
            <div>
            <div className="flex space-x-12 py-10">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e3bca0]"
              >
                <FaSquareFacebook />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e3bca0]"
              >
                <FaTwitter/>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e3bca0]"
              >
                <FaInstagram/>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#e3bca0]"
              >
                <FaLinkedin/>
              </a>
            </div>
          </div>
          </div>
         
          

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-4 ">Contact Us</h3>
            <p className="mb-2">📍123 Charity Street, City, State, 45678</p>
            <p className="mb-2">📞 Phone: (123) 456-7890</p>
            <p>📧 Email: support@charity.com</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="hover:text-[#e3bca0]">
                ▸Home
                </a>
              </li>
              <li>
                <a href="/about" className="hover:text-[#e3bca0]">
                ▸About Us
                </a>
              </li>
              <li>
                <a href="/projects" className="hover:text-[#e3bca0]">
                ▸Projects
                </a>
              </li>
              <li>
                <a href="/contact" className="hover:text-[#e3bca0]">
                ▸Contact Us
                </a>
              </li>
            </ul>
          </div>

          
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p>&copy; 2025 Care Nest. All Rights Reserved.</p>
          <p>Made with 💜 by Kanishka</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
