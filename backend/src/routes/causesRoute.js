import express from "express";
import Causes from "../models/Causes.js";

const router = express.Router();

router.get("/", async (req, res) => {
  // Get the causes data from mongoose Causes model
  try {
    let causes = await Causes.find();
    if (!causes) {
      return res.status(404).json({ message: "causes not found" });
    }
    let response = causes.map((cause) => ({
      title: cause.title,
      description: cause.description,
      image: cause.imageUrl,
      donations: {
        current: cause.current_donation_amount,
        goal: cause.donation_goal,
      },
    }));
    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;