import express from "express";
import razorpay from "razorpay";
import crypto from "crypto";
import dotenv from "dotenv";
import { Users } from "../models/User.js";
import { Payments } from "../models/Payments.js";
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


router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, amount,currency,donatedto} = req.body;
  const user = await Users.findById(userId);
  if (!user) {
    res.status(400).json({ error: 'Invalid user ID' });
  }
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature === razorpay_signature) {
    try {
      // Save the payment details to the database
      const payment = new Payments({
        userId,
        amount,
        currency,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        donatedto,
        status: 'success',
      });

      await payment.save();
      res.status(200).json({ message: 'Payment verified and saved successfully' });
    } catch (error) {
      const payment = new Payments({
        userId,
        amount,
        currency,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        signature: razorpay_signature,
        donatedto,
        status: 'failed',
      });
      await payment.save();
      console.error('Error saving payment:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});

router.get('/payment-history', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    const donations = await Payments.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(donations);
  } catch (error) {
    console.error('Error fetching donations:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router