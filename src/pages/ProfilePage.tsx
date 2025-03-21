import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { User, Mail, Edit2, Save, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface ProfileData {
  full_name: string;
  company: string;
  website: string;
}

const ProfilePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileData>({
    full_name: '',
    company: '',
    website: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data) {
        setProfile({
          full_name: data.full_name || '',
          company: data.company || '',
          website: data.website || ''
        });
      }
    } catch (err: any) {
      console.error('Error fetching profile:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user?.id,
          full_name: profile.full_name,
          company: profile.company,
          website: profile.website,
          updated_at: new Date()
        });

      if (error) throw error;
      
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h2>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full">
              <User className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-800">
                {profile.full_name || user.email?.split('@')[0] || 'User'}
              </h2>
              <div className="text-sm text-gray-500 flex items-center">
                <Mail className="h-4 w-4 mr-1" />
                {user.email}
              </div>
            </div>
          </div>
          
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <Edit2 className="h-4 w-4 mr-1" />
              Edit Profile
            </button>
          )}
        </div>
        
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                id="full_name"
                value={profile.full_name}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                Company
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={profile.company}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
                Website
              </label>
              <input
                type="url"
                name="website"
                id="website"
                value={profile.website}
                onChange={handleChange}
                disabled={!isEditing || isLoading}
                className={`block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${!isEditing ? 'bg-gray-50' : ''}`}
              />
            </div>
          </div>
          
          {isEditing && (
            <div className="mt-6 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  fetchProfile(); // Reset to original values
                }}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isLoading ? (
                  <Loader className="animate-spin h-5 w-5" />
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-1" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfilePage; 