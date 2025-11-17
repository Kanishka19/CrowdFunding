import express from 'express';
import multer from 'multer';
import Profile from '../models/Profile.js';
import { Users } from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Configure multer for profile picture uploads (16MB limit for MongoDB)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 16 * 1024 * 1024, // 16MB limit (MongoDB document limit is 16MB)
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  console.log("Profile route - checking authentication");
  const token = req.cookies?.accessToken;
  
  if (!token) {
    console.log("No accessToken cookie found in profile route");
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_KEY);
    console.log("Profile route - JWT decoded:", decoded);
    // The JWT payload has user_id, not id
    req.user = { id: decoded.user_id };
    console.log("Profile route - authenticated user:", req.user.id);
    next();
  } catch (error) {
    console.log("Profile route - JWT error:", error.message);
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

// GET /api/profile - Get user profile data
router.get('/', authenticateToken, async (req, res) => {
  try {
    console.log('📋 Fetching profile for user:', req.user.id);
    
    // Get user basic info
    const user = await Users.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get profile data (create if doesn't exist)
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      console.log('🆕 Creating new profile for user:', req.user.id);
      profile = new Profile({ userId: req.user.id });
      await profile.save();
    }

    // Combine user and profile data
    const profileData = {
      user: {
        id: user._id,
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
        createdAt: user.createdAt
      },
      profile: {
        profilePictureUrl: profile.profilePictureUrl,
        address: profile.address,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        bio: profile.bio,
        interests: profile.interests,
        socialLinks: profile.socialLinks,
        occupation: profile.occupation,
        organization: profile.organization,
        donationPreferences: profile.donationPreferences,
        privacy: profile.privacy,
        notificationSettings: profile.notificationSettings,
        updatedAt: profile.updatedAt
      }
    };

    res.json(profileData);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile data' });
  }
});

// PUT /api/profile - Update user profile data
router.put('/', authenticateToken, async (req, res) => {
  try {
    console.log('✏️ Updating profile for user:', req.user.id);
    
    const {
      address,
      gender,
      dateOfBirth,
      bio,
      interests,
      socialLinks,
      occupation,
      organization,
      donationPreferences,
      privacy,
      notificationSettings
    } = req.body;

    // Find or create profile
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new Profile({ userId: req.user.id });
    }

    // Update fields if provided
    if (address) profile.address = { ...profile.address, ...address };
    if (gender !== undefined) profile.gender = gender;
    if (dateOfBirth !== undefined) profile.dateOfBirth = dateOfBirth ? new Date(dateOfBirth) : null;
    if (bio !== undefined) profile.bio = bio;
    if (interests !== undefined) profile.interests = interests;
    if (socialLinks) profile.socialLinks = { ...profile.socialLinks, ...socialLinks };
    if (occupation !== undefined) profile.occupation = occupation;
    if (organization !== undefined) profile.organization = organization;
    if (donationPreferences) profile.donationPreferences = { ...profile.donationPreferences, ...donationPreferences };
    if (privacy) profile.privacy = { ...profile.privacy, ...privacy };
    if (notificationSettings) profile.notificationSettings = { ...profile.notificationSettings, ...notificationSettings };

    await profile.save();

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      profile: {
        profilePictureUrl: profile.profilePictureUrl,
        address: profile.address,
        gender: profile.gender,
        dateOfBirth: profile.dateOfBirth,
        bio: profile.bio,
        interests: profile.interests,
        socialLinks: profile.socialLinks,
        occupation: profile.occupation,
        organization: profile.organization,
        donationPreferences: profile.donationPreferences,
        privacy: profile.privacy,
        notificationSettings: profile.notificationSettings,
        updatedAt: profile.updatedAt
      }
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/profile/upload-picture - Upload profile picture
router.post('/upload-picture', authenticateToken, upload.single('profilePicture'), async (req, res) => {
  try {
    console.log('🖼️ Uploading profile picture for user:', req.user.id);
    
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    // Check file size (additional check)
    if (req.file.size > 16 * 1024 * 1024) {
      return res.status(400).json({ error: 'Image too large. Maximum size is 16MB' });
    }

    // Find or create profile
    let profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      profile = new Profile({ userId: req.user.id });
    }

    // Store image data
    profile.profilePicture = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
      size: req.file.size
    };

    await profile.save();

    res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      profilePictureUrl: profile.profilePictureUrl
    });
  } catch (error) {
    console.error('❌ Error uploading profile picture:', error);
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Image too large. Maximum size is 16MB' });
    }
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

// DELETE /api/profile/picture - Delete profile picture
router.delete('/picture', authenticateToken, async (req, res) => {
  try {
    console.log('🗑️ Deleting profile picture for user:', req.user.id);
    
    const profile = await Profile.findOne({ userId: req.user.id });
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }

    profile.profilePicture = undefined;
    await profile.save();

    res.json({
      success: true,
      message: 'Profile picture deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error deleting profile picture:', error);
    res.status(500).json({ error: 'Failed to delete profile picture' });
  }
});

export default router;