import React, { useState, useEffect } from 'react';
import { Lightbulb, Loader } from 'lucide-react';
import { getTrendingKeywords } from '../utils/api';

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

  return (
    <div className="text-center space-y-8 max-w-3xl mx-auto">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
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
          onClick={() => onGenerate(vagueConcept)}
          disabled={!vagueConcept.trim() || isLoading}
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

      {!isLoadingKeywords && trendingKeywords.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-600">Trending Keywords</p>
          <div className="flex flex-wrap gap-2 justify-center">
            {trendingKeywords.map((keyword, index) => (
              <button
                key={index}
                onClick={() => {
                  setVagueConcept(keyword);
                  onGenerate(keyword);
                }}
                disabled={isLoading}
                className="px-3 py-1.5 bg-white text-indigo-600 rounded-full text-sm font-medium border border-indigo-200 hover:bg-indigo-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default IdeaGenerator;