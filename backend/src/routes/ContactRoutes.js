import express from "express";
import Contact from "../models/ContactForm.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const { name, email, message } = req.body;
        const newContact = new Contact({ name, email, message });
        await newContact.save();
        res.status(201).json({ message: "Message saved successfully!" });
    } catch (error) {
        res.status(500).json({ error: "Failed to save message" });
    }
});

export default router;
