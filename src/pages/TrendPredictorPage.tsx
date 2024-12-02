import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, Loader, RefreshCw } from 'lucide-react';
import { getPredictedTrendingKeywords } from '../utils/api';
import type { TrendingKeyword } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface TrendCardProps {
  keyword: TrendingKeyword;
}

const TrendCard: React.FC<TrendCardProps> = ({ keyword }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:border-indigo-500 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold text-gray-900">
          {keyword.keyword}
        </h3>
        <span className={`
          inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
          ${keyword.marketImpact === 'High' ? 'bg-red-100 text-red-800' : 
            keyword.marketImpact === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-green-100 text-green-800'}
        `}>
          {keyword.marketImpact} Impact
        </span>
      </div>
      
      <div className="space-y-4">
        {/* Category */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Category</span>
          <span className="font-medium">{keyword.category}</span>
        </div>

        {/* Trend Score */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Trend Score</span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className="h-full bg-indigo-600 rounded-full"
                style={{ width: `${keyword.score}%` }}
              />
            </div>
            <span className="font-medium">{keyword.score}</span>
          </div>
        </div>
        
        {/* Confidence */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Confidence</span>
          <div className="flex items-center">
            <div className="w-24 h-2 bg-gray-200 rounded-full mr-2">
              <div 
                className="h-full bg-green-600 rounded-full"
                style={{ width: `${keyword.confidence}%` }}
              />
            </div>
            <span className="font-medium">{keyword.confidence}%</span>
          </div>
        </div>

        {/* Growth */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Predicted Growth</span>
          <span className="font-medium text-green-600">
            +{keyword.predictedGrowth}%
          </span>
        </div>

        {/* Timeframe */}
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Timeframe</span>
          <span className="font-medium">{keyword.timeframe}</span>
        </div>

        {/* Industry Focus */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Industry Focus:
          </h4>
          <div className="flex flex-wrap gap-2">
            {keyword.industryFocus.map((industry, i) => (
              <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-700">
                {industry}
              </span>
            ))}
          </div>
        </div>

        {/* Geographic Relevance */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Geographic Relevance:
          </h4>
          <div className="flex flex-wrap gap-2">
            {keyword.geographicRelevance.map((region, i) => (
              <span key={i} className="px-2 py-1 bg-blue-100 rounded-full text-xs text-blue-700">
                {region}
              </span>
            ))}
          </div>
        </div>
        
        {/* Related Events */}
        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Related Events:
          </h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {keyword.relatedEvents.map((event, i) => (
              <li key={i} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{event}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const TrendPredictorPage: React.FC = () => {
  const navigate = useNavigate();
  const [keywords, setKeywords] = useState<TrendingKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTrends = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPredictedTrendingKeywords();
      setKeywords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load trends');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrends();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8 flex justify-between items-center">
        <button
          onClick={() => navigate('/apps')}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Apps</span>
        </button>

        <button
          onClick={loadTrends}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Refresh Trends</span>
        </button>
      </div>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Trending Business Keywords
        </h1>
        <p className="mt-2 text-gray-600">
          AI-powered predictions based on current world events and market conditions
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center space-y-4">
            <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            <p className="text-gray-600">Analyzing current trends...</p>
          </div>
        </div>
      ) : (
        /* Results Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {keywords.map((keyword, index) => (
            <TrendCard key={index} keyword={keyword} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrendPredictorPage; 