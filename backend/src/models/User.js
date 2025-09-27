import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    fullname: { type: String, required: true },  // Required only for registration
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },  // Required only for registration
    birthdate: { type: Date, required: true },  // Required only for registration
    password: { type: String, required: true }
}, { timestamps: true });

export const Users = mongoose.model("User", UserSchema);