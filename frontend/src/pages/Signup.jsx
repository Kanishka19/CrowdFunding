import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Phone, Calendar } from "lucide-react";
import { registerUser } from "../api";

const Signup = () => {
  const [form, setForm] = useState({ fullname: "", email: "", password: "", phone: "", birthdate: "", confirmPassword: "" });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await registerUser(form);
      setSuccess(response.data.message);
      setForm({ fullname: "", email: "", password: "", phone: "", birthdate: "", confirmPassword: "" });
      setTimeout(() => navigate("/login"), 200);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-50 to-fuchsia-200 p-4">
      <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <div className="w-full max-w-lg px-8 py-8 bg-white shadow-xl rounded-2xl">
          <h2 className="text-2xl font-bold text-center text-[#6a27aa] mb-6">Register With Us✨</h2>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {success && <p className="text-green-500 text-center">{success}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField icon={User} name="fullname" type="text" placeholder="Full Name" value={form.fullname} onChange={handleChange} />
            <InputField icon={Mail} name="email" type="email" placeholder="Email Address" value={form.email} onChange={handleChange} />
            <InputField icon={Phone} name="phone" type="tel" placeholder="Phone Number" value={form.phone} onChange={handleChange} />
            <InputField icon={Calendar} name="birthdate" type="date" value={form.birthdate} onChange={handleChange} />
            <InputField icon={Lock} name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
            <InputField icon={Lock} name="confirmPassword" type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={handleChange} />
            <button type="submit" className="w-full bg-[#491e79] hover:bg-[#c5b2db] hover:text-[#271439] text-white py-2 rounded-lg">Sign Up ✨</button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

const InputField = ({ icon: Icon, ...props }) => (
  <div className="relative">
    <Icon className="absolute left-3 top-3 text-gray-500" />
    <input className="pl-10 w-full p-2 border border-gray-300 rounded-md" {...props} required />
  </div>
);

export default Signup;
