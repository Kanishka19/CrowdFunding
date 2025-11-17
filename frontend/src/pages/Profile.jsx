import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Briefcase, 
  Heart, 
  Camera, 
  Edit3, 
  Save, 
  X, 
  Plus,
  Trash2,
  Globe,
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { 
  fetchUserProfile, 
  updateUserProfile, 
  uploadProfilePicture, 
  deleteProfilePicture 
} from '../api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [uploadingPicture, setUploadingPicture] = useState(false);
  
  const fileInputRef = useRef(null);
  
  // Form state
  const [formData, setFormData] = useState({
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    gender: '',
    dateOfBirth: '',
    bio: '',
    interests: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      facebook: '',
      instagram: '',
      website: ''
    },
    occupation: '',
    organization: '',
    donationPreferences: {
      categories: [],
      frequency: '',
      anonymousDonation: false
    }
  });

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Load profile data
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await fetchUserProfile();
      setProfileData(data);
      
      // Populate form data
      setFormData({
        address: data.profile.address || {
          street: '',
          city: '',
          state: '',
          zipCode: '',
          country: ''
        },
        gender: data.profile.gender || '',
        dateOfBirth: data.profile.dateOfBirth ? new Date(data.profile.dateOfBirth).toISOString().split('T')[0] : '',
        bio: data.profile.bio || '',
        interests: data.profile.interests || [],
        socialLinks: data.profile.socialLinks || {
          linkedin: '',
          twitter: '',
          facebook: '',
          instagram: '',
          website: ''
        },
        occupation: data.profile.occupation || '',
        organization: data.profile.organization || '',
        donationPreferences: data.profile.donationPreferences || {
          categories: [],
          frequency: '',
          anonymousDonation: false
        }
      });
    } catch (err) {
      setError('Failed to load profile data');
      console.error('Profile load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    if (section) {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value
        }
      }));
    } else {
      // Direct field update (for bio, gender, etc.)
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const addInterest = (interest) => {
    if (interest.trim() && !formData.interests.includes(interest.trim())) {
      setFormData(prev => ({
        ...prev,
        interests: [...prev.interests, interest.trim()]
      }));
    }
  };

  const removeInterest = (interest) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      await updateUserProfile(formData);
      await loadProfile(); // Reload to get updated data
      setEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleProfilePictureUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check file size (16MB limit)
    if (file.size > 16 * 1024 * 1024) {
      setError('Image too large. Maximum size is 16MB');
      return;
    }

    try {
      setUploadingPicture(true);
      setError('');
      await uploadProfilePicture(file);
      await loadProfile(); // Reload to get updated picture
      setSuccess('Profile picture updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to upload profile picture');
      console.error('Picture upload error:', err);
    } finally {
      setUploadingPicture(false);
    }
  };

  const handleDeletePicture = async () => {
    try {
      setUploadingPicture(true);
      await deleteProfilePicture();
      await loadProfile();
      setSuccess('Profile picture deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to delete profile picture');
      console.error('Picture delete error:', err);
    } finally {
      setUploadingPicture(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-8 px-4">
      {/* Animated background orbs */}
      <motion.div className="absolute -top-32 -left-28 w-72 h-72 rounded-full bg-purple-300/30 blur-3xl" animate={{ scale: [1,1.15,1], opacity:[0.45,0.6,0.45] }} transition={{ duration: 12, repeat: Infinity }} />
      <motion.div className="absolute -bottom-40 -right-32 w-80 h-80 rounded-full bg-pink-300/30 blur-3xl" animate={{ scale: [1,1.2,1], opacity:[0.4,0.55,0.4] }} transition={{ duration: 14, repeat: Infinity }} />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">Manage your account information and preferences</p>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl"
            >
              {error}
            </motion.div>
          )}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl"
            >
              {success}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8 text-center">
              {/* Profile Picture */}
              <div className="relative mb-6">
                <div className="w-32 h-32 mx-auto relative">
                  {profileData?.profile?.profilePictureUrl ? (
                    <img
                      src={profileData.profile.profilePictureUrl}
                      alt="Profile"
                      className="w-full h-full rounded-full object-cover border-4 border-white shadow-lg"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
                      {profileData?.user?.fullname?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                  
                  {/* Upload/Delete buttons */}
                  <div className="absolute -bottom-2 -right-2 flex gap-1">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploadingPicture}
                      className="w-10 h-10 bg-purple-500 hover:bg-purple-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                    >
                      {uploadingPicture ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Camera size={16} />
                      )}
                    </button>
                    {profileData?.profile?.profilePictureUrl && (
                      <button
                        onClick={handleDeletePicture}
                        disabled={uploadingPicture}
                        className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </div>

              {/* Basic Info */}
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {profileData?.user?.fullname || 'User Name'}
              </h2>
              <p className="text-gray-600 mb-4">{profileData?.user?.email}</p>
              
              {formData.bio && (
                <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3 mb-4">
                  {formData.bio}
                </p>
              )}

              <div className="space-y-2 text-sm text-gray-600">
                {profileData?.user?.phone && (
                  <div className="flex items-center justify-center gap-2">
                    <Phone size={16} />
                    <span>{profileData.user.phone}</span>
                  </div>
                )}
                {formData.occupation && (
                  <div className="flex items-center justify-center gap-2">
                    <Briefcase size={16} />
                    <span>{formData.occupation}</span>
                  </div>
                )}
                {formData.address.city && formData.address.country && (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin size={16} />
                    <span>{formData.address.city}, {formData.address.country}</span>
                  </div>
                )}
                <div className="flex items-center justify-center gap-2">
                  <Calendar size={16} />
                  <span>Joined {new Date(profileData?.user?.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Social Links */}
              {(formData.socialLinks.linkedin || formData.socialLinks.twitter || formData.socialLinks.website) && (
                <div className="mt-6 flex justify-center gap-3">
                  {formData.socialLinks.linkedin && (
                    <a href={formData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600">
                      <Globe size={20} />
                    </a>
                  )}
                  {formData.socialLinks.website && (
                    <a href={formData.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:text-purple-600">
                      <Globe size={20} />
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Edit Button */}
            <div className="flex justify-end gap-3">
              {editing ? (
                <>
                  <button
                    onClick={() => setEditing(false)}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition"
                  >
                    <X size={16} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Save size={16} />
                    )}
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
                >
                  <Edit3 size={16} />
                  Edit Profile
                </button>
              )}
            </div>

            {/* Rest of the profile sections will be added in the next part due to length */}
            <ProfileSections 
              formData={formData}
              editing={editing}
              handleInputChange={handleInputChange}
              handleArrayChange={handleArrayChange}
              addInterest={addInterest}
              removeInterest={removeInterest}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Separate component for profile sections
const ProfileSections = ({ 
  formData, 
  editing, 
  handleInputChange, 
  handleArrayChange, 
  addInterest, 
  removeInterest 
}) => {
  const [newInterest, setNewInterest] = useState('');

  return (
    <>
      {/* Personal Information */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <User size={20} />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
            {editing ? (
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange(null, 'gender', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            ) : (
              <p className="text-gray-600">{formData.gender || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth</label>
            {editing ? (
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) => handleInputChange(null, 'dateOfBirth', e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">
                {formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString() : 'Not specified'}
              </p>
            )}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            {editing ? (
              <textarea
                value={formData.bio}
                onChange={(e) => handleInputChange(null, 'bio', e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                maxLength={500}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              />
            ) : (
              <p className="text-gray-600">{formData.bio || 'No bio added yet'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Professional Information */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Briefcase size={20} />
          Professional Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
            {editing ? (
              <input
                type="text"
                value={formData.occupation}
                onChange={(e) => handleInputChange(null, 'occupation', e.target.value)}
                placeholder="Your occupation"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.occupation || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Organization</label>
            {editing ? (
              <input
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange(null, 'organization', e.target.value)}
                placeholder="Your organization"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.organization || 'Not specified'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Address */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <MapPin size={20} />
          Address
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
            {editing ? (
              <input
                type="text"
                value={formData.address.street}
                onChange={(e) => handleInputChange('address', 'street', e.target.value)}
                placeholder="Street address"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.address.street || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
            {editing ? (
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) => handleInputChange('address', 'city', e.target.value)}
                placeholder="City"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.address.city || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">State/Province</label>
            {editing ? (
              <input
                type="text"
                value={formData.address.state}
                onChange={(e) => handleInputChange('address', 'state', e.target.value)}
                placeholder="State/Province"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.address.state || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ZIP Code</label>
            {editing ? (
              <input
                type="text"
                value={formData.address.zipCode}
                onChange={(e) => handleInputChange('address', 'zipCode', e.target.value)}
                placeholder="ZIP Code"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.address.zipCode || 'Not specified'}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Country</label>
            {editing ? (
              <input
                type="text"
                value={formData.address.country}
                onChange={(e) => handleInputChange('address', 'country', e.target.value)}
                placeholder="Country"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <p className="text-gray-600">{formData.address.country || 'Not specified'}</p>
            )}
          </div>
        </div>
      </div>

      {/* Interests */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Heart size={20} />
          Interests
        </h3>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {formData.interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm"
            >
              {interest}
              {editing && (
                <button
                  onClick={() => removeInterest(interest)}
                  className="text-purple-500 hover:text-purple-700"
                >
                  <X size={14} />
                </button>
              )}
            </span>
          ))}
        </div>

        {editing && (
          <div className="flex gap-2">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  addInterest(newInterest);
                  setNewInterest('');
                }
              }}
            />
            <button
              onClick={() => {
                addInterest(newInterest);
                setNewInterest('');
              }}
              className="px-4 py-2 bg-purple-500 text-white rounded-xl hover:bg-purple-600 transition"
            >
              <Plus size={16} />
            </button>
          </div>
        )}
      </div>

      {/* Social Links */}
      <div className="bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Globe size={20} />
          Social Links
        </h3>
        
        <div className="space-y-4">
          {Object.entries(formData.socialLinks).map(([platform, url]) => (
            <div key={platform}>
              <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                {platform}
              </label>
              {editing ? (
                <input
                  type="url"
                  value={url}
                  onChange={(e) => handleInputChange('socialLinks', platform, e.target.value)}
                  placeholder={`Your ${platform} URL`}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              ) : (
                <p className="text-gray-600">
                  {url ? (
                    <a href={url} target="_blank" rel="noopener noreferrer" className="text-purple-500 hover:underline">
                      {url}
                    </a>
                  ) : (
                    'Not specified'
                  )}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </>
  );
};

export default Profile;