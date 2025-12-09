'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Save, Award, Activity, Edit2, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({
    name: '',
    bio: '',
    role: '',
    progress: {},
    createdAt: null
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchUserData();
    }
  }, [status, router]);

  const fetchUserData = async () => {
    try {
      const res = await fetch('/api/user');
      if (res.ok) {
        const data = await res.json();
        setUserData({
            name: data.name || '',
            bio: data.bio || '',
            role: data.role || 'Student',
            progress: data.progress || {},
            createdAt: data.createdAt
        });
      }
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: userData.name, bio: userData.bio }),
      });
      
      if (res.ok) {
        const updated = await res.json();
        setUserData(prev => ({ ...prev, name: updated.name, bio: updated.bio }));
        setIsEditing(false);
        // We might want to trigger a session update here, but next-auth doesn't make it super easy without a page reload or event
        // For now, local state update is enough for the UI
      }
    } catch (error) {
      console.error('Failed to update profile', error);
    } finally {
        setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-purple-500" size={40} />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl overflow-hidden p-8 md:p-12"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center gap-8 mb-12">
          <div className="relative group">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-purple-500/20 p-1 bg-linear-to-br from-purple-500/10 to-blue-500/10 backdrop-blur-sm shadow-xl">
              <img 
                src={session.user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${session.user.email}`} 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover"
              />
            </div>
            <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-black box-content" title="Online" />
          </div>

          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                {isEditing ? (
                     <input 
                        type="text" 
                        value={userData.name}
                        onChange={(e) => setUserData({...userData, name: e.target.value})}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-1 text-2xl font-bold text-white focus:outline-none focus:border-purple-500 w-full md:w-auto"
                     />
                ) : (
                    <h1 className="text-3xl md:text-4xl font-bold text-white">{userData.name}</h1>
                )}
                
                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-semibold uppercase tracking-wider border border-purple-500/30">
                  {userData.role}
                </span>
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 mb-6">
              <Mail size={16} />
              <span>{session.user.email}</span>
            </div>

            {isEditing ? (
                 <textarea 
                    value={userData.bio}
                    onChange={(e) => setUserData({...userData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-gray-300 focus:outline-none focus:border-purple-500 min-h-[100px]"
                 />
            ) : (
                <p className="text-gray-300 max-w-xl text-lg leading-relaxed">
                  {userData.bio || "No bio yet. Click edit to tell your story!"}
                </p>
            )}

            <div className="mt-6 flex justify-center md:justify-start gap-4">
                {isEditing ? (
                     <>
                        <Button onClick={handleSave} disabled={loading} className="gap-2 bg-green-600 hover:bg-green-700">
                             {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Changes
                        </Button>
                        <Button variant="outline" onClick={() => setIsEditing(false)} disabled={loading}>
                            Cancel
                        </Button>
                     </>
                ) : (
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2 border-purple-500/50 text-purple-300 hover:bg-purple-500/10">
                        <Edit2 size={16} /> Edit Profile
                    </Button>
                )}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-purple-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                <Activity size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-medium">Topics Mastered</h3>
                <p className="text-2xl font-bold text-white">
                    {userData.progress ? Object.values(userData.progress).filter(p => p >= 100).length : 0}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-blue-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                <Award size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-medium">Achievements</h3>
                <p className="text-2xl font-bold text-white">Coming Soon</p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-pink-500/30 transition-colors">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-pink-500/20 text-pink-400">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-sm text-gray-400 font-medium">Member Since</h3>
                <p className="text-lg font-bold text-white">
                    {userData.createdAt ? new Date(userData.createdAt).toLocaleDateString() : 'Recently'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
