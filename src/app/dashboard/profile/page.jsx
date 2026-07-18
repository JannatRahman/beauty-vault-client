'use client';

import React, { useState, useEffect } from 'react';
import { useSession, authClient } from '@/lib/auth-client';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Camera, 
  Save, 
  Sparkles, 
  CheckCircle, 
  AlertCircle,
  Image as ImageIcon,
  Loader2
} from 'lucide-react';

// Predefined premium beauty/aesthetic avatars for quick selection
const PRESETS = [
  { name: 'Elegant Rose', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Warm Sun', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Soft Glow', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Fresh Mint', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200' },
  { name: 'Golden Hour', url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200' },
];

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const [name, setName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Sync state with session data when loaded
  useEffect(() => {
    if (session?.user) {
      setName(session.user.name || '');
      setImageUrl(session.user.image || '');
    }
  }, [session]);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    setSuccess('');
    setError('');

    try {
      const { data, error: updateError } = await authClient.updateUser({
        name: name.trim(),
        image: imageUrl.trim() || undefined,
      });

      if (updateError) {
        setError(updateError.message || 'Failed to update profile details.');
      } else {
        setSuccess('Your profile has been updated successfully!');
        // Keep success message for 4 seconds
        setTimeout(() => setSuccess(''), 4000);
      }
    } catch (err) {
      setError('An unexpected error occurred while saving.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-[#E91E63] animate-spin" />
          <p className="text-gray-500 font-medium text-sm">Loading profile data...</p>
        </div>
      </div>
    );
  }

  // Formatting Member Since date
  const memberSince = session?.user?.createdAt 
    ? new Date(session.user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Banner */}
      <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-r from-[#E91E63] to-[#C2185B] p-8 text-white shadow-[0_10px_30px_rgba(233,30,99,0.15)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent)] pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border-2 border-white/40 overflow-hidden flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105">
              {imageUrl ? (
                <img 
                  src={imageUrl} 
                  alt={name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${name || 'user'}`;
                  }}
                />
              ) : (
                <User className="w-12 h-12 text-white" />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white text-[#E91E63] p-1.5 rounded-lg shadow-md border border-[#F8BBD0]/50">
              <Camera className="w-4 h-4" />
            </div>
          </div>

          <div className="text-center md:text-left space-y-2">
            <h1 className="text-3xl font-display font-bold leading-none flex items-center justify-center md:justify-start gap-2">
              {name || 'Beautiful User'}
              <Sparkles className="w-5 h-5 text-pink-200 animate-pulse" />
            </h1>
            <p className="text-pink-100 text-sm font-medium flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 text-pink-200" /> {session?.user?.email}
            </p>
            <p className="text-pink-100/80 text-xs flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4 text-pink-200/80" /> Member since {memberSince}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Avatar Selection Presets */}
        <div className="glass rounded-[2rem] p-6 lg:col-span-1 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#1F2937] flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[#E91E63]" />
              Quick Avatars
            </h2>
            <p className="text-xs text-gray-500 mt-1">Select a premium aesthetic photo for your profile image.</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setImageUrl(preset.url)}
                className={`group flex flex-col items-center p-2 rounded-xl border transition-all ${
                  imageUrl === preset.url 
                    ? 'border-[#E91E63] bg-[#FFF9FB] shadow-sm' 
                    : 'border-gray-100 hover:border-[#F8BBD0] hover:bg-gray-50'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden mb-1.5 border border-gray-100 shadow-sm group-hover:scale-105 transition-transform duration-200">
                  <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] font-medium text-gray-600 truncate max-w-full">{preset.name}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Avatar Seed API</span>
            <button
              type="button"
              onClick={() => setImageUrl(`https://api.dicebear.com/7.x/adventurer/svg?seed=${name || 'VaultUser'}`)}
              className="w-full text-center py-2 px-3 border border-dashed border-[#F8BBD0] text-xs font-medium text-[#E91E63] rounded-xl hover:bg-[#FFF9FB] transition-colors"
            >
              Generate Adventurer Avatar
            </button>
          </div>
        </div>

        {/* Right Side: Profile Edit Form */}
        <div className="glass rounded-[2rem] p-6 lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-[#1F2937]">Profile Settings</h2>
            <p className="text-sm text-gray-500 mt-1">Keep your information up to date so your store experience stays personalized.</p>
          </div>

          {success && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium"
            >
              <CheckCircle className="w-5 h-5 shrink-0" />
              <span>{success}</span>
            </motion.div>
          )}

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm font-medium"
            >
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#4B5563] pl-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#9CA3AF]" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-11 pr-4 py-3 bg-white border border-[#F8BBD0]/50 rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all shadow-sm"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email (Disabled) */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-[#4B5563] pl-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-[#9CA3AF]" />
                  </div>
                  <input
                    type="email"
                    disabled
                    value={session?.user?.email || ''}
                    className="block w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-gray-400 cursor-not-allowed shadow-none"
                  />
                </div>
                <p className="text-[11px] text-gray-400 pl-1">Login email address cannot be changed.</p>
              </div>
            </div>

            {/* Profile Image URL */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-[#4B5563] pl-1">Profile Image URL</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Camera className="h-5 w-5 text-[#9CA3AF]" />
                </div>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="block w-full pl-11 pr-4 py-3 bg-white border border-[#F8BBD0]/50 rounded-2xl text-[#1F2937] placeholder-[#9CA3AF] focus:ring-2 focus:ring-[#E91E63] focus:border-transparent transition-all shadow-sm text-sm"
                  placeholder="https://example.com/avatar.jpg"
                />
              </div>
              <p className="text-[11px] text-gray-400 pl-1">Paste any public image link or choose one of our quick presets on the left.</p>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-gray-100 flex justify-end">
              <button
                type="submit"
                disabled={isUpdating}
                className="btn-primary flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white bg-gradient-to-r from-[#E91E63] to-[#C2185B] shadow-md hover:shadow-lg transition-all disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
