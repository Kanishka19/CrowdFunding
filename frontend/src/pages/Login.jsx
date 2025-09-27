import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../api";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); 
  const {login,logout} = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(email, password,logout);
      console.log("Login successful:", res.data);
      const user = res.data.user; 
      login(user);
      console.log("Navigating to dashboard with user:", user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials!");
    }
  };

  return (
    <div className="bg-[#F5EFFF] text-gray-900 flex items-center justify-center min-h-screen">
      <div className="flex max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">

        {/* Left Side - Image */}
        <div className="hidden md:block w-1/2">
          <img 
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRYjVzfdOBv3xq2aDDGzDVt9cFOBx4fq9pQtg&s" 
            alt="Login" 
            className="w-full h-full object-cover" 
          />
        </div>

        {/* Right Side - Sign In */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <h2 className="text-2xl font-bold mb-4">Welcome Back</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 text-center">Sign in to continue</p>

          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="w-full">
            {/* Email Input */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">Email</label>
              <input 
                type="email" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600" 
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="w-full mb-4">
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="password" 
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none dark:bg-gray-700 dark:border-gray-600" 
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition mb-4">
              Sign In
            </button>
          </form>

          {/* OR Divider */}
          <div className="flex items-center w-full mb-4">
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
            <span className="px-3 text-sm text-gray-500 dark:text-gray-400">OR</span>
            <hr className="flex-grow border-gray-300 dark:border-gray-600" />
          </div>

          {/* Google Sign-in Button */}
          <button className="flex items-center space-x-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-medium py-2 px-6 rounded-md transition shadow-sm">
            <FcGoogle />
            <span>Sign in with Google</span>
          </button>

          {/* Register Link */}
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Don't have an account? 
            <a href="/register" className="text-blue-600 hover:underline ml-1">Register</a>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;
