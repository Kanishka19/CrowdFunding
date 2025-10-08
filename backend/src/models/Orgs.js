import mongoose from "mongoose";

const OrgSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  logoUrl: { type: String, required: true },
  website: { type: String, required: true },
  description: { type: String, required: true },
  yearsActive: { type: Number, required: true },
  verified: { type: Boolean, required: true },
  campaignsSupported: { type: Number, required: true },
  beneficiaries: { type: Number, required: true },
  awards: { type: [String], default: [] }, 
  contactEmail: { type: String, required: true },
  annualReportUrl: { type: String, required: true },
}, { timestamps: true });

export const Orgs = mongoose.model("Orgs", OrgSchema);