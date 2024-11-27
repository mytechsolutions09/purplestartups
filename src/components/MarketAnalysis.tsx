import React from 'react';
import { BarChart, TrendingUp, Users, DollarSign } from 'lucide-react';

interface MarketMetrics {
  marketSize: string;
  growthRate: string;
  competitorCount: number;
  customerAcquisitionCost: string;
}

interface MarketAnalysisProps {
  idea: string;
  metrics: MarketMetrics;
}

function MarketAnalysis({ idea, metrics }: MarketAnalysisProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Market Analysis</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-indigo-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-medium text-gray-600">Market Size</span>
          </div>
          <p className="text-lg font-semibold text-indigo-600">{metrics.marketSize}</p>
        </div>
        
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <BarChart className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Growth Rate</span>
          </div>
          <p className="text-lg font-semibold text-green-600">{metrics.growthRate}</p>
        </div>
        
        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Competitors</span>
          </div>
          <p className="text-lg font-semibold text-blue-600">{metrics.competitorCount}</p>
        </div>
        
        <div className="p-4 bg-purple-50 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <DollarSign className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Avg. CAC</span>
          </div>
          <p className="text-lg font-semibold text-purple-600">{metrics.customerAcquisitionCost}</p>
        </div>
      </div>
    </div>
  );
}

export default MarketAnalysis; 