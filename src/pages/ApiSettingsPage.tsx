import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Key, Plus, Copy, Eye, EyeOff, RefreshCw, Loader, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  created_at: string;
  last_used?: string;
  scopes: string[];
}

const ApiSettingsPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [selectedScopes, setSelectedScopes] = useState<string[]>(['read']);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  const availableScopes = [
    { id: 'read', name: 'Read', description: 'Read-only access to your data' },
    { id: 'write', name: 'Write', description: 'Create and update your data' },
    { id: 'delete', name: 'Delete', description: 'Delete your data' }
  ];

  // Mock data for demo purposes
  useEffect(() => {
    if (user) {
      // Simulate API call to fetch API keys
      setTimeout(() => {
        setApiKeys([
          {
            id: 'key_123456',
            name: 'Development Key',
            key: 'sk_dev_' + Math.random().toString(36).substring(2, 15),
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            last_used: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            scopes: ['read', 'write']
          },
          {
            id: 'key_789012',
            name: 'Production Key',
            key: 'sk_prod_' + Math.random().toString(36).substring(2, 15),
            created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
            last_used: new Date().toISOString(),
            scopes: ['read', 'write', 'delete']
          }
        ]);
        setIsLoading(false);
      }, 1000);
    }
  }, [user]);

  const toggleKeyVisibility = (id: string) => {
    setShowKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const copyToClipboard = (key: string, id: string) => {
    navigator.clipboard.writeText(key)
      .then(() => {
        setCopiedKey(id);
        setTimeout(() => setCopiedKey(null), 2000);
      })
      .catch(err => {
        console.error('Failed to copy key:', err);
        setError('Failed to copy API key to clipboard');
      });
  };

  const generateNewKey = () => {
    if (!newKeyName.trim()) {
      setError('Please provide a name for your API key');
      return;
    }

    if (selectedScopes.length === 0) {
      setError('Please select at least one scope for your API key');
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    // Simulate API call to generate new key
    setTimeout(() => {
      const newKey: ApiKey = {
        id: 'key_' + Math.random().toString(36).substring(2, 10),
        name: newKeyName,
        key: 'sk_' + Math.random().toString(36).substring(2, 30),
        created_at: new Date().toISOString(),
        scopes: selectedScopes
      };
      
      setApiKeys(prev => [newKey, ...prev]);
      setShowKeys(prev => ({
        ...prev,
        [newKey.id]: true
      }));
      
      setNewKeyName('');
      setSelectedScopes(['read']);
      setIsGenerating(false);
      setIsFormVisible(false);
      setSuccess('New API key generated successfully! Make sure to copy it as you won\'t be able to see it again.');
      
      // Auto-hide success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000);
    }, 1500);
  };

  const revokeKey = (id: string) => {
    setApiKeys(prev => prev.filter(key => key.id !== id));
    setSuccess('API key revoked successfully');
    
    // Auto-hide success message after 3 seconds
    setTimeout(() => setSuccess(null), 3000);
  };

  const toggleScope = (scopeId: string) => {
    setSelectedScopes(prev => 
      prev.includes(scopeId)
        ? prev.filter(s => s !== scopeId)
        : [...prev, scopeId]
    );
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

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div>
      <h2 className="text-lg font-medium text-gray-900 mb-6">API Settings</h2>
      
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
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <Key className="h-5 w-5 text-indigo-500 mr-2" />
              API Keys
            </h3>
            
            <button
              type="button"
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isFormVisible ? (
                'Cancel'
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-1" />
                  New API Key
                </>
              )}
            </button>
          </div>
          
          {isFormVisible && (
            <div className="px-4 py-5 sm:p-6 border-b border-gray-200 bg-gray-50">
              <div className="space-y-4">
                <div>
                  <label htmlFor="key-name" className="block text-sm font-medium text-gray-700">
                    Key Name
                  </label>
                  <input
                    type="text"
                    id="key-name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="e.g., Development Key, Production Key"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Give your key a descriptive name to help you identify it later
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Permissions
                  </label>
                  <div className="space-y-2">
                    {availableScopes.map(scope => (
                      <div key={scope.id} className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id={`scope-${scope.id}`}
                            name={`scope-${scope.id}`}
                            type="checkbox"
                            checked={selectedScopes.includes(scope.id)}
                            onChange={() => toggleScope(scope.id)}
                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor={`scope-${scope.id}`} className="font-medium text-gray-700">{scope.name}</label>
                          <p className="text-gray-500">{scope.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="pt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={generateNewKey}
                    disabled={isGenerating}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    {isGenerating ? (
                      <Loader className="animate-spin h-4 w-4 mr-2" />
                    ) : (
                      <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Generate Key
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="px-4 py-5 sm:p-6">
            {apiKeys.length === 0 ? (
              <div className="text-center py-6">
                <Key className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No API keys</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new API key.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => setIsFormVisible(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New API Key
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-500">
                  Your API keys are listed below. Keep them secret! Anyone with your API key has access to your account according to the permissions you've granted.
                </p>
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Key
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Last Used
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Permissions
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {apiKeys.map((key) => (
                        <tr key={key.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {key.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center">
                              <span className="font-mono">
                                {showKeys[key.id] ? key.key : key.key.replace(/(?<=^.{4}).*(?=.{4}$)/, '•'.repeat(16))}
                              </span>
                              <button
                                type="button"
                                onClick={() => toggleKeyVisibility(key.id)}
                                className="ml-2 text-gray-400 hover:text-gray-500"
                                title={showKeys[key.id] ? 'Hide Key' : 'Show Key'}
                              >
                                {showKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(key.key, key.id)}
                                className="ml-1 text-gray-400 hover:text-gray-500"
                                title="Copy to Clipboard"
                              >
                                {copiedKey === key.id ? (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                ) : (
                                  <Copy className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(key.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(key.last_used)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-1">
                              {key.scopes.map(scope => (
                                <span key={scope} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {scope}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => revokeKey(key.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Revoke
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h3 className="text-lg leading-6 font-medium text-gray-900">API Documentation</h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <p className="text-sm text-gray-500 mb-4">
              Use our API to programmatically access your data and integrate with our services.
            </p>
            <div className="rounded-md bg-gray-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">API Base URL</h3>
                  <div className="mt-2 text-sm text-gray-700">
                    <code className="px-2 py-1 bg-gray-100 rounded font-mono">https://api.example.com/v1</code>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <a
                href="#"
                className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View API Documentation
                <svg className="ml-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiSettingsPage; 