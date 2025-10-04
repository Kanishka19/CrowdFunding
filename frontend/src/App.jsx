import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Nav from "./pages/Nav";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Causes from "./pages/Causes";
import Contact from "./pages/Contact";
import Data from "./pages/Data";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import UserNav from "./pages/userNav";
import Donate from "./pages/Donate";
import Blogs from "./pages/Blogs";
import MyDonations from "./pages/myDonations";
import {useAuth} from "./context/AuthContext"

const App = () => {
  const { user} = useAuth();
  return (
    <Router>
      {user ? <UserNav/> : <Nav />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/causes" element={<Causes />} />
        <Route path="/data" element={<Data />} />
        <Route path="/members" element={<Members />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/donate" element={<Donate />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/my-donations" element={<MyDonations />} />
        <Route
          path="/dashboard"
          element={
              <Dashboard />
          }
        />
      </Routes>
      <Footer />
    </Router>



  );
};
export default App;