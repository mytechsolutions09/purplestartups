import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { X, Plus, Save, RefreshCw, AlertTriangle, Search, ChevronDown, ChevronUp } from 'lucide-react';

interface Keyword {
  id: number;
  text: string;
  clicks: number;
  created_at: string;
  active: boolean;
}

const TrendingKeywordsManager: React.FC = () => {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'clicks' | 'alphabetical' | 'newest'>('clicks');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trending_keywords')
        .select('*')
        .order('active', { ascending: false })
        .order('clicks', { ascending: false })
        .limit(100); // Increased limit to accommodate up to 50 active keywords plus some inactive ones
      
      if (error) throw error;
      
      setKeywords(data || []);
    } catch (err: any) {
      console.error('Error fetching keywords:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const addKeyword = async () => {
    if (!newKeyword.trim()) return;
    
    try {
      setSaving(true);
      const { error } = await supabase
        .from('trending_keywords')
        .insert([{ text: newKeyword.trim(), clicks: 0 }]);
      
      if (error) throw error;
      
      setNewKeyword('');
      fetchKeywords();
    } catch (err: any) {
      console.error('Error adding keyword:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const removeKeyword = async (id: number) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('trending_keywords')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setKeywords(keywords.filter(kw => kw.id !== id));
    } catch (err: any) {
      console.error('Error removing keyword:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const toggleKeywordStatus = async (id: number, currentActive: boolean) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('trending_keywords')
        .update({ active: !currentActive })
        .eq('id', id);
      
      if (error) throw error;
      
      setKeywords(keywords.map(kw => 
        kw.id === id ? { ...kw, active: !currentActive } : kw
      ));
    } catch (err: any) {
      console.error('Error toggling keyword status:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const resetClicks = async (id: number) => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('trending_keywords')
        .update({ clicks: 0 })
        .eq('id', id);
      
      if (error) throw error;
      
      setKeywords(keywords.map(kw => 
        kw.id === id ? { ...kw, clicks: 0 } : kw
      ));
    } catch (err: any) {
      console.error('Error resetting clicks:', err);
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSort = (sortType: 'clicks' | 'alphabetical' | 'newest') => {
    if (sortOrder === sortType) {
      // Toggle direction if the same sort type is clicked
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new sort type and default direction
      setSortOrder(sortType);
      setSortDirection(sortType === 'alphabetical' ? 'asc' : 'desc');
    }
  };

  const filteredKeywords = keywords
    .filter(kw => kw.text.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === 'clicks') {
        return sortDirection === 'asc' ? a.clicks - b.clicks : b.clicks - a.clicks;
      } else if (sortOrder === 'alphabetical') {
        return sortDirection === 'asc' 
          ? a.text.localeCompare(b.text) 
          : b.text.localeCompare(a.text);
      } else { // newest
        return sortDirection === 'asc' 
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime() 
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  // Count how many active keywords we have
  const activeKeywordCount = keywords.filter(kw => kw.active).length;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-6">Trending Keywords Manager</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <span>{error}</span>
          <button onClick={() => setError(null)} className="ml-auto">
            <X className="h-5 w-5" />
          </button>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <input
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            placeholder="Enter new keyword..."
            className="px-3 py-2 border border-gray-300 rounded-md w-full mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addKeyword();
              }
            }}
          />
          <button
            onClick={addKeyword}
            disabled={saving || !newKeyword.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50 flex items-center"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            <span className="ml-1">Add</span>
          </button>
        </div>

        <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <span className="text-sm">
            Currently showing {activeKeywordCount} of 50 possible active keywords on the homepage.
          </span>
        </div>
        
        <div className="mb-4 flex items-center">
          <div className="relative flex-1 mr-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search keywords..."
              className="pl-10 px-3 py-2 border border-gray-300 rounded-md w-full"
            />
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleSort('clicks')} 
              className={`px-3 py-1 rounded ${sortOrder === 'clicks' ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              Clicks {sortOrder === 'clicks' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </button>
            <button 
              onClick={() => handleSort('alphabetical')} 
              className={`px-3 py-1 rounded ${sortOrder === 'alphabetical' ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              A-Z {sortOrder === 'alphabetical' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </button>
            <button 
              onClick={() => handleSort('newest')} 
              className={`px-3 py-1 rounded ${sortOrder === 'newest' ? 'bg-gray-200' : 'bg-gray-100'}`}
            >
              Date {sortOrder === 'newest' && (sortDirection === 'asc' ? <ChevronUp className="inline h-4 w-4" /> : <ChevronDown className="inline h-4 w-4" />)}
            </button>
          </div>
        </div>
      </div>
      
      <div className="border rounded-md overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Keyword
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Clicks
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date Added
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center">
                  <RefreshCw className="h-5 w-5 animate-spin inline mr-2" />
                  Loading keywords...
                </td>
              </tr>
            ) : filteredKeywords.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                  No keywords found
                </td>
              </tr>
            ) : (
              filteredKeywords.map((keyword) => (
                <tr key={keyword.id} className={keyword.active ? '' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{keyword.text}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{keyword.clicks}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      keyword.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {keyword.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(keyword.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleKeywordStatus(keyword.id, keyword.active)}
                      className={`mr-2 px-2 py-1 rounded ${
                        keyword.active 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' 
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {keyword.active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => resetClicks(keyword.id)}
                      className="mr-2 px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Reset Clicks
                    </button>
                    <button
                      onClick={() => removeKeyword(keyword.id)}
                      className="px-2 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      
      <div className="mt-8 bg-gray-50 p-4 rounded-md">
        <h3 className="text-md font-medium mb-2">How Keywords Work</h3>
        <ul className="text-sm text-gray-600 space-y-1 list-disc pl-5">
          <li>Keywords are displayed on the homepage in the "Trending Keywords" section</li>
          <li>Up to 50 active keywords will be shown to users</li>
          <li>The most clicked keywords appear higher in the list</li>
          <li>Each click increments the click counter for that keyword</li>
          <li>Users can click keywords to automatically populate the idea generator input</li>
        </ul>
      </div>
    </div>
  );
};

export default TrendingKeywordsManager; 