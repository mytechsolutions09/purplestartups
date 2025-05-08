import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { CheckCircle, AlertCircle, Save, RefreshCw } from 'lucide-react';

interface PayPalSettings {
  client_id: string;
  secret_key: string; // This will be masked in the UI
  webhook_url: string;
  webhook_id: string;
  sandbox_mode: boolean;
  success_url: string;
  cancel_url: string;
}

const PayPalSettings: React.FC = () => {
  const [settings, setSettings] = useState<PayPalSettings>({
    client_id: '',
    secret_key: '',
    webhook_url: '',
    webhook_id: '',
    sandbox_mode: true,
    success_url: '',
    cancel_url: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{type: 'success' | 'error', message: string} | null>(null);
  
  useEffect(() => {
    loadSettings();
  }, []);
  
  const loadSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('category', 'paypal')
        .single();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to load PayPal settings'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const saveSettings = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          category: 'paypal',
          settings: settings,
          updated_at: new Date()
        });
        
      if (error) throw error;
      
      setNotification({
        type: 'success',
        message: 'PayPal settings saved successfully'
      });
      
      // Clear notification after 3 seconds
      setTimeout(() => setNotification(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setNotification({
        type: 'error',
        message: 'Failed to save PayPal settings'
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          PayPal Integration Settings
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          Configure your PayPal integration settings for payment processing
        </p>
      </div>
      
      {notification && (
        <div className={`p-4 ${notification.type === 'success' ? 'bg-green-50' : 'bg-red-50'}`}>
          <div className="flex">
            <div className="flex-shrink-0">
              {notification.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400" />
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                {notification.message}
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          {/* Client ID */}
          <div className="sm:col-span-3">
            <label htmlFor="client_id" className="block text-sm font-medium text-gray-700">
              PayPal Client ID
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="client_id"
                id="client_id"
                value={settings.client_id}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The Client ID from your PayPal Developer Dashboard
            </p>
          </div>

          {/* Secret Key */}
          <div className="sm:col-span-3">
            <label htmlFor="secret_key" className="block text-sm font-medium text-gray-700">
              PayPal Secret Key
            </label>
            <div className="mt-1">
              <input
                type="password"
                name="secret_key"
                id="secret_key"
                value={settings.secret_key}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The Secret Key from your PayPal Developer Dashboard
            </p>
          </div>

          {/* Webhook URL */}
          <div className="sm:col-span-3">
            <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700">
              Webhook URL
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="webhook_url"
                id="webhook_url"
                value={settings.webhook_url}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The URL that PayPal will send webhook events to
            </p>
          </div>

          {/* Webhook ID */}
          <div className="sm:col-span-3">
            <label htmlFor="webhook_id" className="block text-sm font-medium text-gray-700">
              Webhook ID
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="webhook_id"
                id="webhook_id"
                value={settings.webhook_id}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              The ID of the webhook created in your PayPal Developer Dashboard
            </p>
          </div>

          {/* Success URL */}
          <div className="sm:col-span-3">
            <label htmlFor="success_url" className="block text-sm font-medium text-gray-700">
              Success Return URL
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="success_url"
                id="success_url"
                value={settings.success_url}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              URL to redirect users after successful payment
            </p>
          </div>

          {/* Cancel URL */}
          <div className="sm:col-span-3">
            <label htmlFor="cancel_url" className="block text-sm font-medium text-gray-700">
              Cancel Return URL
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="cancel_url"
                id="cancel_url"
                value={settings.cancel_url}
                onChange={handleInputChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              URL to redirect users after canceled payment
            </p>
          </div>

          {/* Sandbox Mode */}
          <div className="sm:col-span-6">
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="sandbox_mode"
                  name="sandbox_mode"
                  type="checkbox"
                  checked={settings.sandbox_mode}
                  onChange={handleInputChange}
                  className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 text-sm">
                <label htmlFor="sandbox_mode" className="font-medium text-gray-700">
                  Sandbox Mode
                </label>
                <p className="text-gray-500">
                  Enable to use PayPal Sandbox for testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
        <button
          type="button"
          onClick={loadSettings}
          disabled={loading}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3"
        >
          <RefreshCw className="h-5 w-5 mr-2" />
          Reload
        </button>
        <button
          type="button"
          onClick={saveSettings}
          disabled={saving}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Save className="h-5 w-5 mr-2" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
};

export default PayPalSettings; 