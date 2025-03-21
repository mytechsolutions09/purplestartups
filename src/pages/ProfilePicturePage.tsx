import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Image, Upload, Check, X, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

const ProfilePicturePage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [avatar, setAvatar] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (user) {
      fetchAvatar();
    }
  }, [user]);

  const fetchAvatar = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data?.avatar_url) {
        setAvatar(data.avatar_url);
      }
    } catch (err: any) {
      console.error('Error fetching avatar:', err);
    }
  };

  const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      setError(null);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // Upload the file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // Update the user profile with the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: publicUrl,
          updated_at: new Date()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setAvatar(publicUrl);
      setSuccess('Avatar updated successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error uploading avatar:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }
    
    try {
      setUploading(true);
      setError(null);

      // Update the user profile to remove the avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          avatar_url: null,
          updated_at: new Date()
        })
        .eq('id', user?.id);

      if (updateError) throw updateError;

      setAvatar(null);
      setSuccess('Avatar removed successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error removing avatar:', err);
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center p-10">
        <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">Profile Picture</h2>
      
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            {success}
          </div>
        )}
        
        <div className="flex items-center space-x-6">
          <div className="bg-gray-100 rounded-full p-1 border border-gray-200 overflow-hidden">
            {avatar ? (
              <img 
                src={avatar} 
                alt="Avatar" 
                className="h-32 w-32 rounded-full object-cover"
              />
            ) : (
              <div className="h-32 w-32 flex items-center justify-center bg-gray-200 rounded-full">
                <Image className="h-12 w-12 text-gray-400" />
              </div>
            )}
          </div>
          
          <div className="space-y-4">
            <h3 className="text-base font-medium text-gray-900">Profile Photo</h3>
            <p className="text-sm text-gray-500">
              Upload a new avatar or remove your current one.
            </p>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {uploading ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                Upload Photo
              </button>
              
              {avatar && (
                <button
                  type="button"
                  onClick={removeAvatar}
                  disabled={uploading}
                  className="inline-flex items-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  {uploading ? (
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <X className="h-4 w-4 mr-2" />
                  )}
                  Remove
                </button>
              )}
              
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={uploadAvatar}
                className="hidden"
              />
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
          <p>Your profile picture will be visible to other users and will appear on your profile and in comments.</p>
          <p className="mt-2">Recommended: Square image, at least 400x400 pixels.</p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePicturePage; 