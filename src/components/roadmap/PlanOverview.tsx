import React from 'react';
import { Rocket, Target, Users, TrendingUp, BarChart } from 'lucide-react';

interface PlanOverviewProps {
  idea: string;
  overview: string;
  problemStatement: string;
  targetMarket: {
    demographics: string[];
    psychographics: string[];
    marketSize: string;
  };
  valueProposition: string;
}

function PlanOverview({ idea, overview, problemStatement, targetMarket, valueProposition }: PlanOverviewProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-8">
          <Rocket className="h-10 w-10 text-indigo-600 bg-indigo-50 p-2 rounded-xl" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{idea}</h2>
            <p className="text-gray-500 mt-1">{overview}</p>
          </div>
        </div>

        {/* Info Cards Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <Target className="h-5 w-5 text-indigo-600 mr-2" />
              Problem Statement
            </h4>
            <p className="text-gray-600">{problemStatement}</p>
          </div>

          <div className="bg-gradient-to-br from-indigo-50 to-white p-6 rounded-xl border border-indigo-100">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
              Value Proposition
            </h4>
            <p className="text-gray-600">{valueProposition}</p>
          </div>
        </div>

        {/* Target Market Section */}
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
            <Users className="h-5 w-5 text-indigo-600 mr-2" />
            Target Market Analysis
          </h4>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Demographics */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-indigo-600">Demographics</h5>
              <ul className="space-y-1">
                {targetMarket.demographics.map((item, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Psychographics */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-indigo-600">Psychographics</h5>
              <ul className="space-y-1">
                {targetMarket.psychographics.map((item, index) => (
                  <li key={index} className="text-gray-600 flex items-center">
                    <div className="h-1.5 w-1.5 rounded-full bg-indigo-400 mr-2" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Market Size */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-indigo-600">Market Size</h5>
              <div className="bg-indigo-50 text-indigo-700 px-3 py-2 rounded-lg font-medium">
                {targetMarket.marketSize}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlanOverview;