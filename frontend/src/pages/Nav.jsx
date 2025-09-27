import { useState } from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { AiOutlineClose, AiOutlineMenu } from "react-icons/ai";
import logo from "../assets/logoss.png";

const Nav = () => {
  const [nav, setNav] = useState(false);
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
          <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/">Home</Link>
          <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/about">About</Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/contact">Contact</Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/signup">SignUp</Link>
        <Link className="p-4 font-glyphic hover:bg-[#e5cbb9] rounded-xl m-2 cursor-pointer duration-300 hover:text-black" to="/login">LogIn</Link>
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
        {/* Mobile Logo */}
        <h1 className="w-full text-3xl font-bold text-[#e5cbb9] m-4">CrowdFund.</h1>

        {/* Mobile Navigation Items */}
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/" onClick={() => setNav(false)}>Home</Link>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <HashLink smooth to="/#about" onClick={() => setNav(false)}>About</HashLink>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <HashLink smooth to="/#contact" onClick={() => setNav(false)}>Contact</HashLink>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/signup" onClick={() => setNav(false)}>SignUp</Link>
        </li>
        <li className="p-4 border-b font-glyphic rounded-xl hover:bg-[#e5cbb9] duration-300 hover:text-black cursor-pointer border-gray-600">
          <Link to="/login" onClick={() => setNav(false)}>LogIn</Link>
        </li>
      </ul>
    </div>
  );
};

export default Nav;
