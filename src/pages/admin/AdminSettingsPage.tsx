import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { supabase } from '../../utils/supabaseClient';
import { 
  Loader, 
  Check, 
  AlertTriangle,
  Save,
  RefreshCw,
  Lock,
  Globe,
  Mail,
  DollarSign,
  PenTool,
  Server,
  Database,
  Code
} from 'lucide-react';

interface Settings {
  site_name: string;
  site_description: string;
  logo_url: string;
  contact_email: string;
  support_email: string;
  enable_signup: boolean;
  maintenance_mode: boolean;
  enable_payments: boolean;
  max_file_size: number;
  default_user_quota: number;
  custom_css: string;
  meta_keywords: string;
  api_rate_limit: number;
}

const defaultSettings: Settings = {
  site_name: 'Startup Guru',
  site_description: 'AI-powered startup idea generation and roadmap planning',
  logo_url: '',
  contact_email: 'contact@example.com',
  support_email: 'support@example.com',
  enable_signup: true,
  maintenance_mode: false,
  enable_payments: true,
  max_file_size: 5,
  default_user_quota: 3,
  custom_css: '',
  meta_keywords: 'startup, AI, business plan, entrepreneur',
  api_rate_limit: 100
};

const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [activeTab, setActiveTab] = useState('general');

  // Load settings from database
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        // Check if settings table exists and has data
        const { data, error } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        
        if (error) {
          if (error.code === 'PGRST116') {
            // No data found, we'll create default settings
            console.log('No settings found, will use defaults');
          } else {
            throw error;
          }
        }
        
        if (data) {
          setSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
        setErrorMessage('Failed to load settings. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    let parsedValue: string | number | boolean = value;
    
    // Handle different input types
    if (type === 'number') {
      parsedValue = Number(value);
    } else if (type === 'checkbox') {
      const target = e.target as HTMLInputElement;
      parsedValue = target.checked;
    }
    
    setSettings({
      ...settings,
      [name]: parsedValue
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      setIsSubmitting(true);
      
      // Check if settings exists
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('id')
        .single();
      
      let result;
      
      if (fetchError && fetchError.code === 'PGRST116') {
        // No data found, insert new settings
        result = await supabase
          .from('site_settings')
          .insert([settings]);
      } else {
        // Update existing settings
        result = await supabase
          .from('site_settings')
          .update(settings)
          .eq('id', data.id);
      }
      
      if (result.error) throw result.error;
      
      setSuccessMessage('Settings updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your application's global settings and configurations
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader className="h-8 w-8 text-indigo-500 animate-spin" />
          </div>
        ) : (
          <div>
            {errorMessage && (
              <div className="mb-4 p-4 rounded-md bg-red-50 border border-red-200">
                <div className="flex items-center">
                  <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
                  <p className="text-sm font-medium text-red-800">{errorMessage}</p>
                </div>
              </div>
            )}
            
            {successMessage && (
              <div className="mb-4 p-4 rounded-md bg-green-50 border border-green-200">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <p className="text-sm font-medium text-green-800">{successMessage}</p>
                </div>
              </div>
            )}
            
            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex -mb-px">
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'general'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('general')}
                  >
                    General
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'security'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('security')}
                  >
                    Security
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'email'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('email')}
                  >
                    Email
                  </button>
                  <button
                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'advanced'
                        ? 'border-indigo-500 text-indigo-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                    onClick={() => setActiveTab('advanced')}
                  >
                    Advanced
                  </button>
                </nav>
              </div>
              
              {/* Settings form */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Globe className="h-6 w-6 text-indigo-500 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">General Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="site_name" className="block text-sm font-medium text-gray-700">
                          Site Name
                        </label>
                        <input
                          type="text"
                          name="site_name"
                          id="site_name"
                          value={settings.site_name}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700">
                          Logo URL
                        </label>
                        <input
                          type="text"
                          name="logo_url"
                          id="logo_url"
                          value={settings.logo_url}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="https://example.com/logo.png"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="site_description" className="block text-sm font-medium text-gray-700">
                          Site Description
                        </label>
                        <textarea
                          name="site_description"
                          id="site_description"
                          rows={3}
                          value={settings.site_description}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Brief description of your site for SEO and social sharing
                        </p>
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="meta_keywords" className="block text-sm font-medium text-gray-700">
                          Meta Keywords
                        </label>
                        <input
                          type="text"
                          name="meta_keywords"
                          id="meta_keywords"
                          value={settings.meta_keywords}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="startup, AI, business plan, entrepreneur"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Comma-separated keywords for SEO
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Security Settings */}
                {activeTab === 'security' && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Lock className="h-6 w-6 text-indigo-500 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enable_signup"
                            name="enable_signup"
                            type="checkbox"
                            checked={settings.enable_signup}
                            onChange={handleInputChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enable_signup" className="font-medium text-gray-700">
                            Enable User Registration
                          </label>
                          <p className="text-gray-500">
                            Allow new users to register on the platform
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="maintenance_mode"
                            name="maintenance_mode"
                            type="checkbox"
                            checked={settings.maintenance_mode}
                            onChange={handleInputChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="maintenance_mode" className="font-medium text-gray-700">
                            Maintenance Mode
                          </label>
                          <p className="text-gray-500">
                            Put the site in maintenance mode. Only administrators can access the site.
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="default_user_quota" className="block text-sm font-medium text-gray-700">
                          Default User Quota (Free Plans)
                        </label>
                        <input
                          type="number"
                          name="default_user_quota"
                          id="default_user_quota"
                          min="0"
                          value={settings.default_user_quota}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Number of plans free users can create
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="api_rate_limit" className="block text-sm font-medium text-gray-700">
                          API Rate Limit
                        </label>
                        <input
                          type="number"
                          name="api_rate_limit"
                          id="api_rate_limit"
                          min="1"
                          value={settings.api_rate_limit}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Maximum number of API requests per hour per user
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Email Settings */}
                {activeTab === 'email' && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Mail className="h-6 w-6 text-indigo-500 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">Email Settings</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact_email" className="block text-sm font-medium text-gray-700">
                          Contact Email
                        </label>
                        <input
                          type="email"
                          name="contact_email"
                          id="contact_email"
                          value={settings.contact_email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Main contact email displayed on your site
                        </p>
                      </div>
                      
                      <div>
                        <label htmlFor="support_email" className="block text-sm font-medium text-gray-700">
                          Support Email
                        </label>
                        <input
                          type="email"
                          name="support_email"
                          id="support_email"
                          value={settings.support_email}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Email used for support requests
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Advanced Settings */}
                {activeTab === 'advanced' && (
                  <div className="space-y-6">
                    <div className="flex items-center mb-6">
                      <Server className="h-6 w-6 text-indigo-500 mr-3" />
                      <h3 className="text-lg font-medium text-gray-900">Advanced Settings</h3>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="enable_payments"
                            name="enable_payments"
                            type="checkbox"
                            checked={settings.enable_payments}
                            onChange={handleInputChange}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="enable_payments" className="font-medium text-gray-700">
                            Enable Payment Processing
                          </label>
                          <p className="text-gray-500">
                            Allow users to purchase premium plans and subscriptions
                          </p>
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="max_file_size" className="block text-sm font-medium text-gray-700">
                          Maximum File Upload Size (MB)
                        </label>
                        <input
                          type="number"
                          name="max_file_size"
                          id="max_file_size"
                          min="1"
                          value={settings.max_file_size}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      </div>
                      
                      <div className="sm:col-span-2">
                        <label htmlFor="custom_css" className="block text-sm font-medium text-gray-700">
                          Custom CSS
                        </label>
                        <textarea
                          name="custom_css"
                          id="custom_css"
                          rows={5}
                          value={settings.custom_css}
                          onChange={handleInputChange}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono"
                          placeholder=".custom-class { color: #333; }"
                        />
                        <p className="mt-2 text-sm text-gray-500">
                          Custom CSS that will be applied globally to your site
                        </p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="mt-8 border-t border-gray-200 pt-5">
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      onClick={() => setSettings(defaultSettings)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2 inline" />
                      Reset to Default
                    </button>
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminSettingsPage; 