import mongoose from "mongoose";
const paymentsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentId: { type: String, required: true },
    orderId: { type: String, required: true },
    signature: { type: String, required: true },
    donatedto: { type: String, required: true },
    status: { type: String, required: true },
}, { timestamps: true });

export const Payments = mongoose.model("Payment", paymentsSchema);