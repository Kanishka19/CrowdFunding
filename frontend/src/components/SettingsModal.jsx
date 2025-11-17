import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Bell, 
  Check,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchUserProfile, updateUserProfile } from '../api';

const SettingsModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileData, setProfileData] = useState(null);
  
  // Newsletter settings state
  const [newsletterSettings, setNewsletterSettings] = useState({
    subscribed: false,
    frequency: ''
  });

  // Load profile data when modal opens
  useEffect(() => {
    if (isOpen && user) {
      loadProfileData();
    }
  }, [isOpen, user]);

  const loadProfileData = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await fetchUserProfile();
      setProfileData(data);
      
      // Set newsletter settings from profile data
      const newsletter = data.profile?.notificationSettings?.newsletter || {};
      setNewsletterSettings({
        subscribed: newsletter.subscribed || false,
        frequency: newsletter.frequency || ''
      });
    } catch (err) {
      console.error('Error loading profile:', err);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleNewsletterToggle = () => {
    setNewsletterSettings(prev => ({
      ...prev,
      subscribed: !prev.subscribed,
      frequency: !prev.subscribed ? 'weekly' : prev.frequency // Default to weekly when subscribing
    }));
  };

  const handleFrequencyChange = (frequency) => {
    setNewsletterSettings(prev => ({
      ...prev,
      frequency
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');

      // Prepare the update data
      const updateData = {
        notificationSettings: {
          ...profileData?.profile?.notificationSettings,
          newsletter: {
            subscribed: newsletterSettings.subscribed,
            frequency: newsletterSettings.frequency,
            subscribedAt: newsletterSettings.subscribed ? new Date().toISOString() : null
          }
        }
      };

      await updateUserProfile(updateData);
      
      setSuccess('Settings updated successfully!');
      setTimeout(() => {
        setSuccess('');
        onClose();
      }, 2000);
      
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setError('');
    setSuccess('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-xl rounded-3xl p-8 w-full max-w-md relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Settings
            </h3>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <AlertCircle size={16} />
              {error}
            </motion.div>
          )}

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4 flex items-center gap-2"
            >
              <Check size={16} />
              {success}
            </motion.div>
          )}

          {/* Settings Content */}
          {!loading && (
            <div className="space-y-6">
              {/* Newsletter Subscription */}
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-purple-600" size={20} />
                  <h4 className="font-semibold text-gray-800">Newsletter Subscription</h4>
                </div>
                
                {/* Subscribe Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div>
                    <p className="font-medium text-gray-700">Subscribe to Newsletter</p>
                    <p className="text-sm text-gray-500">Get updates about new causes and campaigns</p>
                  </div>
                  <button
                    onClick={handleNewsletterToggle}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      newsletterSettings.subscribed ? 'bg-purple-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        newsletterSettings.subscribed ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {/* Frequency Selection */}
                {newsletterSettings.subscribed && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <Bell size={16} className="text-purple-600" />
                      <p className="font-medium text-gray-700">Email Frequency</p>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'daily', label: 'Daily' },
                        { value: 'weekly', label: 'Weekly' },
                        { value: 'monthly', label: 'Monthly' }
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => handleFrequencyChange(option.value)}
                          className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            newsletterSettings.frequency === option.value
                              ? 'bg-purple-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SettingsModal;