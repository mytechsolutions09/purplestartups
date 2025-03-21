import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link, useNavigate } from 'react-router-dom';
import { FileText, Trash2, ExternalLink, Loader, AlertTriangle, Search } from 'lucide-react';
import { supabase } from '../utils/supabaseClient';
import { useSavedPlans } from '../contexts/SavedPlansContext';

const SavedIdeasPage: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const { savedPlans, removePlan, isLoading, error } = useSavedPlans();
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Filter ideas based on search term
  const filteredIdeas = savedPlans.filter(plan => 
    plan.idea.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteIdea = (id: string) => {
    if (confirmDelete === id) {
      removePlan(id);
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  console.log('Available saved plans:', savedPlans);

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
    <>
      <div className="w-full">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Saved Ideas</h2>
          </div>
          
          <div className="p-6">
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search saved ideas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-6">
                <Loader className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
                <p className="text-gray-600 mt-2">Loading your saved ideas...</p>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400 mr-2" />
                  <span>{error}</span>
                </div>
              </div>
            ) : filteredIdeas.length === 0 ? (
              <div className="text-center py-6">
                {searchTerm ? (
                  <p className="text-gray-600">No ideas matching "{searchTerm}"</p>
                ) : (
                  <>
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-600">You haven't saved any ideas yet.</p>
                    <p className="text-gray-500 text-sm mt-1">Generate a startup idea to get started!</p>
                  </>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredIdeas.map((idea) => (
                  <li key={idea.id} className="py-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-medium text-gray-800">{idea.idea}</h3>
                        <p className="text-sm text-gray-500">
                          Saved on {new Date(idea.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/roadmap/${idea.id}`)}
                          className="inline-flex items-center p-1.5 border rounded-md border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                          title="View details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteIdea(idea.id)}
                          className={`inline-flex items-center p-1.5 border rounded-md ${
                            confirmDelete === idea.id
                              ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                          title={confirmDelete === idea.id ? 'Click again to confirm' : 'Delete'}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default SavedIdeasPage; 