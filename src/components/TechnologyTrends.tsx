import React from 'react';
import type { TechnologyTrend } from '../types';

interface TechnologyTrendsProps {
  trends: TechnologyTrend[];
}

function TechnologyTrends({ trends }: TechnologyTrendsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-l font-semibold"></h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {trends.map((trend, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-medium">{trend.name}</h3>
              <span className={`
                px-2 py-1 text-sm rounded-full
                ${trend.maturityLevel === 'growing' ? 'bg-purple-100 text-purple-700' : 
                  trend.maturityLevel === 'emerging' ? 'bg-blue-100 text-blue-700' : 
                  'bg-gray-100 text-gray-700'}
              `}>
                {trend.maturityLevel}
              </span>
            </div>
            
            <p className="text-gray-600 mb-4">{trend.description}</p>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Relevance Score:</span>
                <span className="font-medium">{trend.relevanceScore}/10</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Implementation:</span>
                <span className={`
                  text-sm font-medium
                  ${trend.implementationComplexity === 'high' ? 'text-red-600' :
                    trend.implementationComplexity === 'medium' ? 'text-orange-600' :
                    'text-green-600'}
                `}>
                  {trend.implementationComplexity}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Est. Cost:</span>
                <span className="text-sm">{trend.estimatedCost}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TechnologyTrends; 