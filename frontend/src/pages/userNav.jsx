import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, LogOut, Cog, UserCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logoss.png";

const UserNav = () => {
  const [nav, setNav] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const { logout, user } = useAuth();
  const profileRef = useRef(null);

  const handleNav = () => {
    setNav(!nav);
  };

  // Close profile menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-40 bg-[#694F8E] flex justify-between items-center h-20 max-w-100 mx-auto px-4 text-white">
      <div>
        <img src={logo} alt="logo" className="h-10 w-auto" />
      </div>

      {/* Desktop Navigation */}
      <ul className="hidden md:flex items-center">
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/campaign">
          Campaigns
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/causes">
          Causes
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/blogs">
          Blog Posts
        </Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/my-donations">
          My Donations
        </Link>

        {/* Profile dropdown */}
        <div className="relative p-4" ref={profileRef}>
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center rounded-full p-2 hover:bg-[#e5cbb9] transition"
            aria-expanded={profileOpen}
            aria-haspopup="true"
          >
            <User className="w-6 h-6 text-white" />
          </button>

          {profileOpen && (
            <div
              className="absolute right-0 mt-3 w-64 rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-b from-white/90 to-white/70 border border-gray-200 shadow-2xl shadow-black/20 animate-fadeIn z-50"
              role="menu"
            >
              {/* Profile header with avatar */}
              <div className="flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-[#f3e8ff] to-[#efe7ff]">
                <div className="h-12 w-12 rounded-full bg-[#694F8E]/10 flex items-center justify-center text-xl font-semibold text-[#694F8E]">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user?.fullname} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <span>{(user?.fullname || "U").split(" ").map(n=>n[0]).slice(0,2).join("")}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{user?.fullname}</p>
                  <p className="text-sm text-gray-500 truncate w-40">{user?.email}</p>
                </div>
              </div>

              {/* Quick actions */}
              <div className="px-3 py-2 grid grid-cols-2 gap-2">
                <Link to="/profile" className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 border border-gray-100 text-sm">
                  <UserCheck className="w-4 h-4 text-gray-700" />
                  <span className="text-[#694F8E]">Profile</span>
                </Link>

                <Link to="/settings" className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/60 hover:bg-white/80 border border-gray-100 text-sm">
                  {/* inline gear icon */}
                  <Cog className="text-black w-4 h-4" />
                  <span className="text-[#694F8E]">Settings</span>
                </Link>
              </div>

              <div className="border-t my-1"></div>

              {/* Menu Items */}
              <div className="flex flex-col px-2 py-1">
                <Link
                  to="/help"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-all"
                  role="menuitem"
                >
                  <span className="text-sm">Help Center</span>
                </Link>

                <Link
                  to="/feedback"
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-700 transition-all"
                  role="menuitem"
                >
                  <span className="text-sm">Send Feedback</span>
                </Link>
              </div>

              <div className="border-t my-1"></div>

              {/* Logout */}
              <div className="px-2 py-2">
                <button
                  onClick={() => {
                    logout();
                    window.location.href = "/";
                  }}
                  className="flex items-center w-full px-3 py-2 rounded-lg justify-center gap-2 bg-white text-red-600 hover:bg-red-50 border border-red-100 transition-all"
                  role="menuitem"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </ul>

      {/* Mobile Navigation Icon */}
      <div onClick={handleNav} className="block md:hidden z-50">
        {nav ? <AiOutlineClose size={20} /> : <AiOutlineMenu size={20} />}
      </div>

      {/* Mobile Navigation Menu */}
      <ul
        className={
          nav
            ? "fixed md:hidden left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#694F8E] ease-in-out duration-500 z-40"
            : "ease-in-out w-[60%] duration-500 fixed top-0 bottom-0 left-[-100%] z-40"
        }
      >
        <h1 className="w-full text-3xl font-bold text-[#e5cbb9] m-4">CrowdFund</h1>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/blogs" onClick={() => setNav(false)}>Blog Posts</Link>
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
