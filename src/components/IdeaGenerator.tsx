import React, { useState, useEffect } from 'react';
import { Lightbulb, Loader, Sparkles } from 'lucide-react';
import { getTrendingKeywords } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '../contexts/SubscriptionContext';
import QuotaExceededModal from './QuotaExceededModal';
import TrendingKeywords from './TrendingKeywords';

interface IdeaGeneratorProps {
  vagueConcept: string;
  setVagueConcept: (value: string) => void;
  onGenerate: (concept: string) => void;
  isLoading: boolean;
}

function IdeaGenerator({ vagueConcept, setVagueConcept, onGenerate, isLoading }: IdeaGeneratorProps) {
  // State for trending keywords suggestions
  const [trendingKeywords, setTrendingKeywords] = useState<string[]>([]);
  const [isLoadingKeywords, setIsLoadingKeywords] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { canGeneratePlan, incrementPlansGenerated, remainingPlans, subscription } = useSubscription();
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  // Load trending keywords on component mount
  useEffect(() => {
    const loadTrendingKeywords = async () => {
      try {
        const keywords = await getTrendingKeywords();
        setTrendingKeywords(keywords);
      } catch (error) {
        console.error('Failed to load trending keywords:', error);
      } finally {
        setIsLoadingKeywords(false);
      }
    };

    loadTrendingKeywords();
  }, []);

  // Handle Enter key press for idea generation
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && vagueConcept.trim() && !isLoading) {
      onGenerate(vagueConcept);
    }
  };

  const handleGenerateClick = () => {
    if (vagueConcept.trim() && !isLoading) {
      onGenerate(vagueConcept);
    }
  };

  const handleGenerateIdea = async () => {
    // Check if the user can generate a plan
    if (!canGeneratePlan) {
      setShowQuotaModal(true);
      return;
    }
    
    try {
      // Increment counter only on success
      await incrementPlansGenerated();
    } catch (err) {
      setErrorMessage('Failed to generate idea. Please try again.');
      console.error(err);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setVagueConcept(keyword);
  };

  // Replace with empty JSX if needed
  const quotaDisplay = <></>;

  return (
    <>
      <div className="text-center space-y-8 max-w-3xl mx-auto">
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-2xl">
            Transform Your Vague Idea Into a
            <span className="text-indigo-600"> Viable Startup</span>
          </h1>
          <p className="text-lg text-gray-600">
            Enter your concept and let us generate actionable startup ideas with detailed roadmaps
          </p>
        </div>

        <div className="flex space-x-4">
          <input
            type="text"
            value={vagueConcept}
            onChange={(e) => setVagueConcept(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Enter your concept (e.g., 'sustainable fashion')"
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            disabled={isLoading}
          />
          <button
            onClick={handleGenerateClick}
            disabled={isLoading || !vagueConcept.trim()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isLoading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <Lightbulb className="h-5 w-5" />
            )}
            <span>{isLoading ? 'Generating...' : 'Generate Ideas'}</span>
          </button>
        </div>

        <TrendingKeywords onKeywordClick={handleKeywordClick} />

        {successMessage && (
          <div className="mt-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {user && (
          <div className="text-center mt-2 mb-4">
            <div className="inline-flex items-center bg-indigo-50 px-3 py-1 rounded-full text-sm text-indigo-700">
              <Sparkles className="h-4 w-4 mr-1.5" />
              <span>{remainingPlans} of {subscription.plansLimit} plan generations remaining</span>
            </div>
          </div>
        )}

        {quotaDisplay}
      </div>

      <QuotaExceededModal 
        isOpen={showQuotaModal} 
        onClose={() => setShowQuotaModal(false)} 
      />
    </>
  );
}

export default IdeaGenerator;