import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Phone, Calendar, ArrowRight, ArrowLeft, Eye, EyeOff, CheckCircle, Shield } from "lucide-react";
import FancyInput from "../components/FancyInput";
import { registerUser } from "../api";

const passwordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: 'Empty' };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  return { score, label: labels[Math.max(0, score - 1)] };
};

const steps = [
  { id: 0, title: 'Your Identity', icon: User, fields: ['fullname', 'email'] },
  { id: 1, title: 'Security', icon: Shield, fields: ['password', 'confirmPassword'] },
  { id: 2, title: 'Details', icon: Phone, fields: ['phone', 'birthdate'] },
  { id: 3, title: 'Review & Submit', icon: CheckCircle, fields: [] }
];

const Signup = () => {
  const [form, setForm] = useState({ fullname: '', email: '', password: '', phone: '', birthdate: '', confirmPassword: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [step, setStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // Scroll to top when Signup page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canAdvance = () => {
    if (step === 0) return form.fullname.trim().length >= 2 && /.+@.+\..+/.test(form.email);
    if (step === 1) {
      const strength = passwordStrength(form.password).score >= 3;
      return strength && form.password === form.confirmPassword;
    }
    if (step === 2) return form.phone.trim().length >= 7 || form.birthdate !== '';
    return true;
  };

  const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    try {
      const response = await registerUser(form);
      setSuccess(response.data.message || 'Registration successful');
      setTimeout(() => navigate('/login'), 600);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  const current = steps[step];
  const strength = passwordStrength(form.password);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_30%_30%,#d8c7ff,#f3e8ff,#ffffff)] flex items-center justify-center px-4 py-10">
      {/* Animated background orbs */}
      <motion.div className="absolute -top-32 -left-32 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl" animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }} transition={{ repeat: Infinity, duration: 10 }} />
      <motion.div className="absolute -bottom-32 -right-32 w-72 h-72 rounded-full bg-fuchsia-300/30 blur-3xl" animate={{ scale: [1, 1.15, 1], opacity: [0.35, 0.5, 0.35] }} transition={{ repeat: Infinity, duration: 12 }} />

      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="w-full max-w-3xl relative">
        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <div key={s.id} className="flex-1 flex flex-col items-center">
              <div className={`w-full h-2 rounded-full ${i <= step ? 'bg-gradient-to-r from-purple-500 to-pink-400' : 'bg-gray-200'}`}></div>
              <span className={`mt-2 text-xs font-medium ${i === step ? 'text-purple-700' : 'text-gray-400'}`}>{s.title}</span>
            </div>
          ))}
        </div>

        <motion.div layout className="relative w-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl px-10 pt-10 pb-8 overflow-hidden">
          <div className="absolute inset-0 rounded-3xl pointer-events-none [mask-image:linear-gradient(to_bottom,rgba(255,255,255,0.9),rgba(255,255,255,0.4))]" />
          <motion.h2 key={current.title} initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }} className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-500 text-transparent bg-clip-text">
            {current.title}
          </motion.h2>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="grid gap-5"
              >
                {/* Step 0 */}
                {step === 0 && (
                  <>
                    <FancyInput icon={User} label="Full Name" name="fullname" type="text" value={form.fullname} onChange={handleChange} placeholder="e.g. Aisha Verma" />
                    <FancyInput icon={Mail} label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
                  </>
                )}
                {/* Step 1 */}
                {step === 1 && (
                  <>
                    <div>
                      <FancyInput icon={Lock} label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={handleChange} placeholder="Choose a strong password">
                        <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute right-3 top-1/2 -translate-y-1/2 text-black hover:text-purple-600">
                          {showPassword ? <EyeOff size={18} className="text-black" /> : <Eye size={18} className="text-black" />}
                        </button>
                      </FancyInput>
                      {/* Strength meter */}
                      <div className="mt-2 flex items-center gap-2">
                        {[0,1,2,3].map(i => (
                          <div key={i} className={`h-2 flex-1 rounded ${i < strength.score ? 'bg-gradient-to-r from-purple-500 to-pink-400' : 'bg-gray-200'}`}></div>
                        ))}
                        <span className="text-xs font-medium text-gray-600">{strength.label}</span>
                      </div>
                    </div>
                    <FancyInput icon={Lock} label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password" />
                    {form.confirmPassword && form.password !== form.confirmPassword && (
                      <p className="text-xs text-red-500 -mt-3">Passwords do not match</p>
                    )}
                  </>
                )}
                {/* Step 2 */}
                {step === 2 && (
                  <>
                    <FancyInput icon={Phone} label="Phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" />
                    <FancyInput icon={Calendar} label="Birthdate" name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-gray-500">
                      Optional info helps us personalize your experience.
                    </motion.div>
                  </>
                )}
                {/* Step 3 */}
                {step === 3 && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <h3 className="font-semibold text-purple-700 mb-2 text-sm">Review</h3>
                      <ul className="text-xs space-y-1 text-gray-700">
                        <li><span className="font-medium">Name:</span> {form.fullname || '—'}</li>
                        <li><span className="font-medium">Email:</span> {form.email || '—'}</li>
                        <li><span className="font-medium">Phone:</span> {form.phone || '—'}</li>
                        <li><span className="font-medium">Birthdate:</span> {form.birthdate || '—'}</li>
                      </ul>
                    </div>
                    <p className="text-xs text-gray-500">By continuing you agree to our Terms of Service & Privacy Policy.</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                disabled={step === 0 || submitting}
                onClick={prevStep}
                className={`flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg transition ${step === 0 ? 'opacity-0 pointer-events-none' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
              >
                <ArrowLeft size={16} /> Back
              </button>

              {step < steps.length - 1 && (
                <button
                  type="button"
                  onClick={nextStep}
                  disabled={!canAdvance()}
                  className={`flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-lg shadow transition ${canAdvance() ? 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                >
                  Next <ArrowRight size={16} />
                </button>
              )}

              {step === steps.length - 1 && (
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-lg shadow bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:brightness-110 disabled:opacity-50`}
                >
                  {submitting ? 'Submitting…' : 'Create Account'}
                </button>
              )}
            </div>
          </form>
          {/* Footer link */}
          <div className="mt-6 text-center text-xs text-gray-600">
            Already have an account? <button onClick={() => navigate('/login')} className="text-purple-600 hover:underline font-medium">Log in</button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Signup;
