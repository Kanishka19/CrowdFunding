import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profilePicture: {
    data: Buffer,
    contentType: String,
    size: Number
  },
  address: {
    street: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    zipCode: { type: String, default: '' },
    country: { type: String, default: '' }
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say', ''],
    default: ''
  },
  dateOfBirth: {
    type: Date,
    default: null
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  interests: [{
    type: String
  }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    twitter: { type: String, default: '' },
    facebook: { type: String, default: '' },
    instagram: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  occupation: {
    type: String,
    default: ''
  },
  organization: {
    type: String,
    default: ''
  },
  donationPreferences: {
    categories: [{
      type: String
    }],
    frequency: {
      type: String,
      enum: ['one-time', 'monthly', 'quarterly', 'yearly', ''],
      default: ''
    },
    anonymousDonation: {
      type: Boolean,
      default: false
    }
  },
  privacy: {
    showEmail: { type: Boolean, default: false },
    showPhone: { type: Boolean, default: false },
    showDOB: { type: Boolean, default: false },
    showAddress: { type: Boolean, default: false }
  },
  notificationSettings: {
    emailNotifications: { type: Boolean, default: true },
    smsNotifications: { type: Boolean, default: false },
    pushNotifications: { type: Boolean, default: true },
    newsletter: {
      subscribed: { type: Boolean, default: false },
      frequency: { 
        type: String, 
        enum: ['daily', 'weekly', 'monthly', ''], 
        default: '' 
      },
      subscribedAt: { type: Date, default: null }
    }
  }
}, {
  timestamps: true
});

// Virtual for profile picture URL
profileSchema.virtual('profilePictureUrl').get(function() {
  if (this.profilePicture && this.profilePicture.data) {
    return `data:${this.profilePicture.contentType};base64,${this.profilePicture.data.toString('base64')}`;
  }
  return null;
});

// Ensure virtual fields are serialized
profileSchema.set('toJSON', { virtuals: true });

const Profile = mongoose.model('Profile', profileSchema);

export default Profile;