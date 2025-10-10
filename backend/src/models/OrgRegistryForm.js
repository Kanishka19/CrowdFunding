import mongoose from "mongoose";

const orgRegistrySchema = new mongoose.Schema({
  orgName: { type: String, required: true },
  registrationNumber: { type: String, required: true }, 
  organizationType: { type: String, required: true }, 
  dateOfEstablishment: { type: Date, required: true },
  address: { type: String, required: true },
  cityStatePincode: { type: String, required: true },
  websiteOrSocialLinks: { type: String }, 
  officialEmail: { type: String, required: true },
  contactNumbers: { type: [String], required: true }, 

  authorizedRepresentativeDetails: {
    fullName: { type: String, required: true },
    designation: { type: String, required: true },
    governmentIdProof: { type: String, required: true }, 
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
  }
}, { timestamps: true });

export const OrgRegistry = mongoose.model("OrgRegistry", orgRegistrySchema);