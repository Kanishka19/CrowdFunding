import axios from "axios";

const API = axios.create({
  baseURL: "/api/auth", // Change this to match your backend URL
  withCredentials: true, // Allows cookies (tokens)
});

// Login API
export const loginUser = async (email, password,logout) => {
  const loginRes= API.post("/login", { email, password}, { withCredentials: true });
  if((await loginRes).status === 401)
  {
    logout();
  }
  else
  {
    return loginRes;
  }
};
// Register API
export const registerUser = async (userData) => {
  return API.post("/register", userData);
};

// Logout API (optional)
export const logoutUser = async () => {
  return API.delete("/logout"); 
};

const PUBLIC_API = axios.create({
  baseURL: "/api",
});

// Fetch blogs
export const fetchBlogs = async () => {
  const res = await PUBLIC_API.get("/blogs");
  return res.data;
};

const PAYMENT_API = axios.create({
  baseURL: "/api/payment",
  withCredentials: true,
});

export const fetchHistory = async (userId) => {
  const res = await PAYMENT_API.get(`/payment-history?userId=${userId}`);
  return res.data;
}