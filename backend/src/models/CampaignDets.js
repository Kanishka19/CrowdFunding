import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  imageUrl: { type: String, required: true },
  raisedAmount: { type: Number, required: true },
  goalAmount: { type: Number, required: true },
  donorsCount: { type: Number, required: true },
  daysRemaining: { type: Number, required: true },
  organizer: { type: Object, required: true },
  location: { type: String, required: true },
  impact: { type: String, required: true },
  isLive: { type: Boolean, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

export const Campaign = mongoose.model("Campaign", campaignSchema);