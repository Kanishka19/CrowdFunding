import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Github, Sparkles } from 'lucide-react';
import FancyInput from '../components/FancyInput';
import { useAuth } from '../context/AuthContext';
import { loginUser } from '../api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, logout } = useAuth();

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await loginUser(email, password, logout);
      const user = res.data.user;
      login(user);
      navigate('/campaign');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials!');
    } finally {
      setLoading(false);
    }
  };

  // single hero image (static)
  const heroImage = 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=60';

  // parallax pointer tracking
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);
  const handlePointerMove = (e) => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPointer({ x, y });
  };

  // removed impact counters per request

  // compute parallax transforms (subtle)
  const tiltX = (pointer.y / 600) * -8; // invert for natural tilt
  const tiltY = (pointer.x / 600) * 8;

  return (
    <div onMouseMove={handlePointerMove} className="relative min-h-screen flex items-center justify-center px-4 py-10 bg-[linear-gradient(115deg,#f8f5ff_0%,#efe5ff_22%,#fde7ff_48%,#ffffff_70%)] overflow-hidden">
      {/* Ambient animated orbs */}
      <motion.div className="absolute -top-32 -left-28 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl" animate={{ scale: [1,1.15,1], opacity:[0.45,0.6,0.45] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -right-32 w-80 h-80 rounded-full bg-pink-300/30 blur-3xl" animate={{ scale: [1,1.2,1], opacity:[0.4,0.55,0.4] }} transition={{ duration: 14, repeat: Infinity }} />
      <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] rounded-full bg-gradient-to-tr from-purple-200/20 via-pink-100/10 to-purple-300/20 blur-2xl" animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: 'linear' }} />
      {/* subtle gradient mesh overlays */}
      <div className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-70">
        <div className="absolute top-10 left-14 w-64 h-64 bg-[radial-gradient(circle_at_center,#e1d4ff,#ffffff_70%)] rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-12 right-10 w-72 h-72 bg-[radial-gradient(circle_at_center,#ffd9f2,#ffffff_65%)] rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="relative w-full max-w-6xl grid md:grid-cols-2 gap-10">
        {/* Left hero / rotating carousel */}
        <motion.div
          ref={heroRef}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          style={{ transform: `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}
          className="hidden md:flex flex-col justify-between p-8 rounded-3xl text-white shadow-2xl relative overflow-hidden will-change-transform"
        >
          {/* Static hero image */}
          <div className="absolute inset-0">
            <motion.div
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url('${heroImage}')` }}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/70 via-purple-800/55 to-fuchsia-800/60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.15),transparent_70%)]" />
          </div>
          <div className="relative z-10 space-y-5">
            <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3"><Sparkles size={30} className="text-yellow-300" />Welcome Back</h1>
            <p className="text-sm leading-relaxed text-purple-100/90 max-w-md">Access your impact hub: monitor campaigns, follow causes, and amplify the difference you make.</p>
            {/* scrolling quotes */}
            <div className="mt-6 h-20 overflow-hidden relative">
              <ScrollingQuotes />
            </div>
          </div>
          {/* particle trail */}
          <ParticleField pointer={pointer} />
        </motion.div>

        {/* Form card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl px-10 pt-10 pb-8 overflow-hidden"
        >
          <div className="absolute inset-0 rounded-3xl pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.85),rgba(255,255,255,0.35))]" />
          <motion.h2 initial={{ opacity:0,y:-15 }} animate={{ opacity:1,y:0 }} className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text">
            Sign In
          </motion.h2>

          {error && (
            <AnimatePresence>
              <motion.p
                initial={{ opacity:0,y:-6 }}
                animate={{ opacity:1,y:0 }}
                exit={{ opacity:0,y:-6 }}
                className="text-red-600 text-xs font-medium mb-4"
              >
                {error}
              </motion.p>
            </AnimatePresence>
          )}

          <form onSubmit={handleLogin} className="space-y-5 relative z-10">
            {/* Email */}
            <FancyInput
              icon={Mail}
              label="Email"
              name="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {/* Password */}
            <FancyInput
              icon={Lock}
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            >
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-purple-600 transition"
              >
                {showPassword ? <EyeOff size={18} className="text-black" /> : <Eye size={18} className="text-black" />}
              </button>
            </FancyInput>
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 select-none">
                <input type="checkbox" className="accent-purple-600" />
                <span className="text-gray-600">Remember me</span>
              </label>
              <button type="button" className="text-purple-600 font-medium hover:underline">Forgot password?</button>
            </div>
            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold py-3 rounded-xl shadow-lg shadow-purple-600/30 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in…' : <>Sign In <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="h-px bg-gradient-to-r from-purple-300 to-pink-300 flex-1" />
            <span className="text-[10px] tracking-wide text-gray-500">OR CONTINUE WITH</span>
            <div className="h-px bg-gradient-to-r from-pink-300 to-purple-300 flex-1" />
          </div>

            <div className="grid grid-cols-2 gap-3">
              <SocialButton icon={<FcGoogle className="text-xl" />} label="Google" />
              <SocialButton icon={<Github size={16} />} label="GitHub" />
            </div>

          <p className="mt-8 text-xs text-gray-600 text-center">
            New here? <button onClick={() => navigate('/signup')} className="text-purple-600 font-semibold hover:underline">Create an account</button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Reusable input with floating label & icon
// Removed FloatingInput in favor of shared FancyInput for consistent design language.

const SocialButton = ({ icon, label }) => (
  <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }} type="button" className="flex items-center justify-center gap-2 w-full rounded-xl border border-gray-200 bg-white/70 backdrop-blur-sm py-2 text-xs font-medium text-gray-700 hover:border-purple-400 hover:shadow-md transition">
    {icon}
    {label}
  </motion.button>
);

export default Login;

// Particle field following pointer (subtle trailing dots)
const ParticleField = ({ pointer }) => {
  const [particles, setParticles] = useState([]);
  const frameRef = useRef();
  const lastPointer = useRef(pointer);

  useEffect(() => { lastPointer.current = pointer; }, [pointer]);

  useEffect(() => {
    const MAX = 40;
    const tick = () => {
      setParticles(ps => {
        const next = ps
          .map(p => ({ ...p, life: p.life - 0.02, y: p.y + 0.3 }))
          .filter(p => p.life > 0);
        // add new particle when moved significantly
        if (Math.hypot(pointer.x - lastPointer.current.x, pointer.y - lastPointer.current.y) > 6) {
          next.push({
            id: crypto.randomUUID(),
            x: pointer.x, y: pointer.y, life: 1,
            hue: 265 + Math.random() * 40
          });
          lastPointer.current = pointer;
        }
        return next.slice(-MAX);
      });
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [pointer]);

  return (
    <div className="pointer-events-none absolute inset-0">
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute w-2 h-2 rounded-full"
          style={{
            left: `calc(50% + ${p.x}px)`,
            top: `calc(50% + ${p.y}px)`,
            background: `hsl(${p.hue}deg 90% 70% / ${p.life})`,
            transform: 'translate(-50%,-50%) scale(0.9)',
            filter: 'blur(2px)'
          }}
        />
      ))}
    </div>
  );
};

// Quotes component auto-scrolls inspirational lines
const ScrollingQuotes = () => {
  const quotes = [
    '“Your generosity rewrites stories.”',
    '“Small acts create massive waves.”',
    '“Hope grows when we share.”',
    '“Together, impact is exponential.”',
    '“Every campaign is a heartbeat.”'
  ];
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % quotes.length), 3500);
    return () => clearInterval(id);
  }, []);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
        className="text-xs font-medium text-purple-100/90 tracking-wide"
      >
        {quotes[index]}
      </motion.div>
    </AnimatePresence>
  );
};
