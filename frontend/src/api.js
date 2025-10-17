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

//Donate API
export const donate = async (userId,amount) => {
  return API.post(`/payment/donate?userId=${userId}`,{
    amount: amount, 
    currency: "INR",
  }, { withCredentials: true });
}

//verify donation
export const verifyDonation = async (userId,amount,currency,razorpay_payment_id,razorpay_order_id,razorpay_signature,donatedto) => {
  return API.post(`/payment/verify-payment?userId=${userId}`, {
    userId,
    amount,
    currency,
    razorpay_payment_id,
    razorpay_order_id,
    razorpay_signature,
    donatedto
  }, { withCredentials: true });
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

export const fetchRegisterOrg = async (orgForm) => {
  const res = await API.post("/fileupload/registerOrg",orgForm,{ withCredentials: true });
  console.log('I am res data:',res.data);
  return res.data;
}

export const fetchUploadOrg = async (orgId, orgFiles) => {
  const formdata = new FormData();
  formdata.append("orgId", orgId);
  for (let i = 0; i < orgFiles.length; i++) {
    formdata.append("files", orgFiles[i]);
  }
  console.log('I am form data:',formdata);
  const res = await API.post("/fileupload/uploadOrg",formdata,{ withCredentials: true });
  return res.data;
}