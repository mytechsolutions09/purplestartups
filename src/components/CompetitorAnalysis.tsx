import React from 'react';
import { Users, Target, TrendingUp, Shield } from 'lucide-react';

interface Competitor {
  name: string;
  strengths: string[];
  weaknesses: string[];
  marketShare: string;
  uniqueSellingPoints: string[];
}

interface CompetitorAnalysisProps {
  competitors: Competitor[];
}

function CompetitorAnalysis({ competitors }: CompetitorAnalysisProps) {
  if (!competitors || competitors.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-600" />
          Competitor Analysis
        </h2>
        <div className="text-center py-8">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500">No competitor data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Shield className="h-6 w-6 text-indigo-600" />
        Competitor Analysis
      </h2>
      
      <div className="grid gap-6">
        {competitors.map((competitor, index) => (
          <div key={index} className="border border-gray-100 rounded-lg p-4 hover:border-indigo-100 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <h3 className="font-medium text-gray-900">{competitor.name}</h3>
              <span className="text-sm text-indigo-600 font-medium">{competitor.marketShare} market share</span>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Strengths</h4>
                <ul className="space-y-1">
                  {competitor.strengths.map((strength, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      {strength}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600">Weaknesses</h4>
                <ul className="space-y-1">
                  {competitor.weaknesses.map((weakness, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400" />
                      {weakness}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompetitorAnalysis; 