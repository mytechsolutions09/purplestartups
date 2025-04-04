import React from 'react';
import { useTrendingKeywords } from '../hooks/useTrendingKeywords';

interface TrendingKeywordsProps {
  onKeywordClick?: (keyword: string) => void;
}

const TrendingKeywords: React.FC<TrendingKeywordsProps> = ({ onKeywordClick }) => {
  const { keywords, loading, error, incrementKeywordClick } = useTrendingKeywords();

  const handleKeywordClick = (keyword: string, id: number) => {
    if (onKeywordClick) {
      onKeywordClick(keyword);
    }
    incrementKeywordClick(id);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="text-center text-gray-500 mb-3">Loading trending keywords...</div>
        <div className="flex flex-wrap justify-center gap-2">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="h-8 w-20 bg-gray-200 rounded-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center">{error}</div>;
  }

  if (keywords.length === 0) {
    return <div className="text-gray-500 text-center">No trending keywords available</div>;
  }

  return (
    <div>
      <h3 className="text-center text-gray-700 font-medium mb-3">Trending Keywords</h3>
      <div className="flex flex-wrap justify-center gap-2 max-h-[300px] overflow-y-auto p-2">
        {keywords.map((keyword) => (
          <button
            key={keyword.id}
            onClick={() => handleKeywordClick(keyword.text, keyword.id)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-full text-sm transition-colors whitespace-nowrap"
          >
            {keyword.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingKeywords; 