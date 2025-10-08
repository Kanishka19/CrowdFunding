import axios from "axios";

const API = axios.create({
  baseURL: "/api", // Change this to match your backend URL
  withCredentials: true, // Allows cookies (tokens)
});

// Login API
export const loginUser = async (email, password,logout) => {
  const loginRes= API.post("/auth/login", { email, password}, { withCredentials: true });
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
  return API.post("/auth/register", userData);
};

// Logout API (optional)
export const logoutUser = async () => {
  return API.delete("/auth/logout"); 
};

// Fetch blogs
export const fetchBlogs = async () => {
  const res = await API.get("/blogs", { withCredentials: true });
  return res.data;
};

export const fetchHistory = async (userId) => {
  const res = await API.get(`/payment/payment-history?userId=${userId}`);
  return res.data;
}

export const fetchCampaigns = async () => {
  const res = await API.get("/org-campaign/campaign", { withCredentials: true });
  return res.data;
}

export const fetchOrganizations = async () => {
  const res = await API.get("/org-campaign/organization", { withCredentials: true });
  return res.data;
}