import express from "express";
import razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();

const router = express.Router();


const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


router.post("/donate", async (req, res) => {
    console.log("req.body:", req.body); 
    const { amount, currency } = req.body || {};
    if (!amount) {
      return res.status(400).json({ error: "Amount is required" });
    }
  
    try {
      const order = await razorpayInstance.orders.create({
        amount: Number(amount) * 100,
        currency: currency || "INR",
        receipt: `receipt_${Date.now()}`,
      });
      res.status(200).json(order);
    } catch (err) {
      console.error("Razorpay order error:", err);
      res.status(500).json({ error: err.message });
    }
  });
  

router.post('/verify-payment', (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    res.status(200).json({ message: 'Payment verified successfully' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});

export default router