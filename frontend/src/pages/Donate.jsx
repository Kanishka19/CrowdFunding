import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
const Donate = ({donatedto}) => {
  const [amount, setAmount] = useState("");
  const { user } = useAuth(); 
  // Function to dynamically load the Razorpay script
  const loadRazorpayScript = (src) => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Function to handle the donation process
  const handleDonate = async () => {
    if (!amount || isNaN(amount) || amount <= 0) {
      alert("Please enter a valid donation amount.");
      return;
    }

    // Load the Razorpay script
    const isScriptLoaded = await loadRazorpayScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!isScriptLoaded) {
      alert("Failed to load Razorpay SDK. Please check your internet connection.");
      return;
    }

    try {
      const orderResponse = await axios.post("/api/payment/donate", {
        amount: amount, 
        currency: "INR",
      });

      const { id: order_id, amount: orderAmount, currency } = orderResponse.data;

      // Razorpay payment options
      const options = {
        key: "rzp_test_RM3vr2J4Va0x2M", 
        amount: orderAmount.toString(), 
        currency: currency,
        name: "My Charity Org",
        description: "Donation for Cause",
        order_id: order_id,
        handler: async function (response) {
          try {
            // Send matching field names to backend
            const verifyResponse = await axios.post("/api/payment/verify-payment", {
              userId: user.id,
              amount,
              currency,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              donatedto
            });

            if (verifyResponse.status === 200) {
              alert("Thank you for your donation!");
              window.location.href="/my-donations"

            } else {
              alert("Payment verification failed. Please contact support.");
            }
          } catch (error) {
            console.error("Error verifying payment:", error);
            alert("An error occurred while verifying the payment.");
          }
        },
        prefill: {
          name: "John Doe", // Example pre-filled user details
          email: "johndoe@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#694F8E", // Customize the Razorpay theme color
        },
      };

      // Open the Razorpay payment modal
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error("Error creating Razorpay order:", error.response?.data || error);
      alert("An error occurred while initiating the payment. Please try again.");
    }
  };

  return (
    <div className="donate-container">
      <input
        type="number"
        placeholder="Enter donation amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border border-gray-300 rounded px-4 py-2 mb-4"
      />
      <button
        className="bg-[#694F8E] text-white px-6 py-2 rounded-full font-semibold hover:bg-[#563a70] transition-colors duration-300"
        onClick={handleDonate}
      >
        Donate Now
      </button>
    </div>
  );
};

export default Donate;
