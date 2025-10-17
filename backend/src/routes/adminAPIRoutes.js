import express from "express";
import { Campaign } from "../models/CampaignDets.js";
import Causes from "../models/Causes.js";
import { Orgs } from "../models/Orgs.js";

const router = express.Router();

// Route to add a new campaign
router.post("/campaigns/add", async (req, res) => {
  try {
    const { id, title, description, category, imageUrl, raisedAmount, goalAmount, donorsCount, daysRemaining, organizer, location, impact, isLive } = req.body;

    const existingCampaign = await Campaign.findOne({ id });
    if (existingCampaign) {
      return res.status(400).json({ message: "Campaign with this ID already exists." });
    }

    const newCampaign = new Campaign({
      id,
      title,
      description,
      category,
      imageUrl,
      raisedAmount,
      goalAmount,
      donorsCount,
      daysRemaining,
      organizer,
      location,
      impact,
      isLive,
    });

    await newCampaign.save();
    res.status(201).json({ message: "Campaign added successfully.", campaign: newCampaign });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding the campaign.", error: error.message });
  }
});

// Route to delete a campaign
router.delete("/campaigns/delete", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Missing 'query' parameter in query string." });
        }

        let criteria;
        try {
            criteria = JSON.parse(query);
        } catch (err) {
            return res.status(400).json({ message: "Invalid JSON in 'query' parameter." });
        }

        const campaign = await Campaign.findOne(criteria);
        if (!campaign) {
            return res.status(404).json({ message: "No campaign found matching the criteria." });
        }

        await Campaign.deleteOne(criteria);
        res.status(200).json({ message: "Campaign deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the campaign.", error: error.message });
    }
});

// Route to add a new cause
router.post("/causes/add", async (req, res) => {
  try {
    const { title, description, imageUrl, donation_goal, current_donation_amount } = req.body;

    const existingCause = await Causes.findOne({ title });
    if (existingCause) {
      return res.status(400).json({ message: "Cause with this title already exists." });
    }

    const newCause = new Causes({
      title,
      description,
      imageUrl,
      donation_goal,
      current_donation_amount,
    });

    await newCause.save();
    res.status(201).json({ message: "Cause added successfully.", cause: newCause });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding the cause.", error: error.message });
  }
});

// Route to delete a cause
router.delete("/causes/delete", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Missing 'query' parameter in query string." });
        }

        let criteria;
        try {
            criteria = JSON.parse(query);
        } catch (err) {
            return res.status(400).json({ message: "Invalid JSON in 'query' parameter." });
        }

        const cause = await Causes.findOne(criteria);
        if (!cause) {
            return res.status(404).json({ message: "No cause found matching the criteria." });
        }

        await Causes.deleteOne(criteria);
        res.status(200).json({ message: "Cause deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the cause.", error: error.message });
    }
});

// Route to add a new organization
router.post("/orgs/add", async (req, res) => {
  try {
    const { id, name, logoUrl, website, description, yearsActive, verified, campaignsSupported, beneficiaries, awards, contactEmail, annualReportUrl } = req.body;

    const existingOrg = await Orgs.findOne({ id });
    if (existingOrg) {
      return res.status(400).json({ message: "Organization with this ID already exists." });
    }

    const newOrg = new Orgs({
      id,
      name,
      logoUrl,
      website,
      description,
      yearsActive,
      verified,
      campaignsSupported,
      beneficiaries,
      awards,
      contactEmail,
      annualReportUrl,
    });

    await newOrg.save();
    res.status(201).json({ message: "Organization added successfully.", organization: newOrg });
  } catch (error) {
    res.status(500).json({ message: "An error occurred while adding the organization.", error: error.message });
  }
});

// Route to delete an organization
router.delete("/orgs/delete", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Missing 'query' parameter in query string." });
        }

        let criteria;
        try {
            criteria = JSON.parse(query);
        } catch (err) {
            return res.status(400).json({ message: "Invalid JSON in 'query' parameter." });
        }

        const org = await Orgs.findOne(criteria);
        if (!org) {
            return res.status(404).json({ message: "No organization found matching the criteria." });
        }

        await Orgs.deleteOne(criteria);
        res.status(200).json({ message: "Organization deleted successfully." });
    } catch (error) {
        res.status(500).json({ message: "An error occurred while deleting the organization.", error: error.message });
    }
});

export default router;