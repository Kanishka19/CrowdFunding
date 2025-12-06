import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion';
import ScrollProgress from './components/ScrollProgress';
import AmbientBackground from './components/AmbientBackground';
import { useReducedMotionPref, createPageVariants } from './motionConfig';
import Nav from "./pages/Nav";
import About from "./pages/About";
import Footer from "./pages/Footer";
import Contact from "./pages/Contact";
import Data from "./pages/Data";
import Members from "./pages/Members";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import UserNav from "./pages/userNav";
import Donate from "./pages/Donate";
import Blogs from "./pages/Blogs";
import MyDonations from "./pages/MyDonations";
import Campaign from "./pages/Campaign";
import Causes from "./pages/Causes";
import Profile from "./pages/Profile";
import {useAuth} from "./context/AuthContext"

const PageWrapper = ({ children }) => {
  const reduced = useReducedMotionPref();
  const variants = createPageVariants(reduced);
  return (
    <motion.div
      variants={variants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
};

const AnimatedRoutes = ({ user }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/data" element={<PageWrapper><Data /></PageWrapper>} />
        <Route path="/members" element={<PageWrapper><Members /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/signup" element={<PageWrapper><Signup /></PageWrapper>} />
        <Route path="/donate" element={<PageWrapper><Donate /></PageWrapper>} />
        <Route path="/blogs" element={<PageWrapper><Blogs /></PageWrapper>} />
        <Route path="/my-donations" element={<PageWrapper><MyDonations /></PageWrapper>} />
        <Route path="/campaign" element={<PageWrapper><Campaign /></PageWrapper>} />
        <Route path="/causes" element={<PageWrapper><Causes /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><Profile /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const { user } = useAuth();
  return (
    <Router>
      <AmbientBackground />
      <ScrollProgress />
      {user ? <UserNav /> : <Nav />}
      <AnimatedRoutes user={user} />
      <Footer />
    </Router>
  );
};
export default App;