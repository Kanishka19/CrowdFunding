import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: { 
        type: String,  
        required: true, 
        unique: true,
        lowercase:true,
    },
    password: { type: String, required: true },
})

export const Users = mongoose.model("User", userSchema);