import express from 'express';
import {Campaign} from '../models/CampaignDets.js' 
import {Orgs} from '../models/Orgs.js'; 

const router = express.Router();

// Route to get campaign details by ID
router.get('/campaign', async (req, res) => {
    try {
        const campaign = await Campaign.find();
        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found' });
        }
        res.json(campaign);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to get registered organization details by ID
router.get('/organization', async (req, res) => {
    try {
        const organization = await Orgs.find()
        if (!organization) {
            return res.status(404).json({ message: 'Organization not found' });
        }
        res.json(organization);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router