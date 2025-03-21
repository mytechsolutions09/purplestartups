import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Bell, Save, Loader, AlertTriangle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface NotificationSettings {
  email_updates: boolean;
  startup_news: boolean;
  marketing: boolean;
  account_activity: boolean;
}

const NotificationsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [settings, setSettings] = useState<NotificationSettings>({
    email_updates: true,
    startup_news: false,
    marketing: false,
    account_activity: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchNotificationSettings();
    }
  }, [user]);

  const fetchNotificationSettings = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('notification_settings')
        .eq('id', user?.id)
        .single();

      if (error) throw error;
      
      if (data?.notification_settings) {
        setSettings(data.notification_settings);
      }
    } catch (err: any) {
      console.error('Error fetching notification settings:', err);
      setError('Failed to load notification preferences');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (setting: keyof NotificationSettings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const savePreferences = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          notification_settings: settings,
          updated_at: new Date()
        })
        .eq('id', user?.id);

      if (error) throw error;
      
      setSuccess('Notification preferences saved successfully!');
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(null);
      }, 3000);
    } catch (err: any) {
      console.error('Error saving notification settings:', err);
      setError(err.message || 'Failed to save notification preferences');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || isLoading) {
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
      <h2 className="text-lg font-medium text-gray-900 mb-6">Notification Preferences</h2>
      
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
        
        <div className="bg-white rounded-lg">
          <div className="border-b border-gray-200 pb-5">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Bell className="h-5 w-5 text-indigo-500 mr-2" />
              Manage Notifications
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Choose which notifications you'd like to receive
            </p>
          </div>
          
          <div className="pt-5 space-y-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="email_updates"
                  name="email_updates"
                  type="checkbox"
                  checked={settings.email_updates}
                  onChange={() => handleToggle('email_updates')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="email_updates" className="font-medium text-gray-700">Email Updates</label>
                <p className="text-gray-500">Receive important updates about your account</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="startup_news"
                  name="startup_news"
                  type="checkbox"
                  checked={settings.startup_news}
                  onChange={() => handleToggle('startup_news')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="startup_news" className="font-medium text-gray-700">Startup News</label>
                <p className="text-gray-500">Weekly newsletter with startup trends and news</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="marketing"
                  name="marketing"
                  type="checkbox"
                  checked={settings.marketing}
                  onChange={() => handleToggle('marketing')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="marketing" className="font-medium text-gray-700">Marketing</label>
                <p className="text-gray-500">Promotional offers and new features</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="account_activity"
                  name="account_activity"
                  type="checkbox"
                  checked={settings.account_activity}
                  onChange={() => handleToggle('account_activity')}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="account_activity" className="font-medium text-gray-700">Account Activity</label>
                <p className="text-gray-500">Security alerts and login notifications</p>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={savePreferences}
                disabled={isSaving}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSaving ? (
                  <Loader className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage; 