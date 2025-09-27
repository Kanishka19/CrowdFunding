import React, { useState } from "react";
import { Link } from "react-router-dom";
import { User, LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logoss.png";

const UserNav = () => {
  const [nav, setNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout } = useAuth();

  const handleNav = () => {
    setNav(!nav);
  };

  return (
    <div className="bg-[#694F8E] flex justify-between items-center h-20 max-w-100 mx-auto px-4 text-white">
      <div>
        <img src={logo} alt="logo" />
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex">
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/campaigns">
          Campaigns
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/causes">
          Causes
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/blog-posts">
          Blog Posts
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/my-donations">
          My Donations
        </Link>
        <div className="relative p-4">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center rounded-full p-2 hover:bg-[#e5cbb9]"
          >
            <User className="w-6 h-6 text-white" />
          </button>
          {profileOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg">
              <Link
                to="/profile"
                className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                Profile
              </Link>
              <button
                onClick={logout}
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#694F8E] ease-in-out duration-500"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%]"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#e5cbb9] m-4">CrowdFund</h1>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/blog-posts" onClick={() => setNav(false)}>Blog Posts</Link>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/campaigns" onClick={() => setNav(false)}>Campaigns</Link>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/my-donations" onClick={() => setNav(false)}>My Donations</Link>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <button
            onClick={() => {
              logout();
              setNav(false);
            }}
            className="flex items-center w-full"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </li>
      </ul>
    </div>
  );
};

export default UserNav;