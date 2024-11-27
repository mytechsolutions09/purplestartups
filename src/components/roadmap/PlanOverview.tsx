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
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      {/* Header Section */}
      <div className="flex items-center space-x-3 mb-6">
        <Rocket className="h-10 w-10 text-indigo-600 bg-indigo-50 p-2 rounded-xl" />
        <div>
          <h4 className="text-2xl font-semi-bold text-gray-900">{idea}</h4>
          <p className="text-gray-500 mt-1">{overview}</p>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Target className="h-5 w-5 text-indigo-600 mr-2" />
          Problem Statement
        </h4>
        <p className="text-gray-600">{problemStatement}</p>
      </div>

      {/* Target Market Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6 mb-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <Users className="h-5 w-5 text-indigo-600 mr-2" />
          Target Market Analysis
        </h4>
        <div className="grid md:grid-cols-3 gap-6">
          {/* Demographics */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 hover:border-indigo-100 transition-all">
            <h5 className="text-sm font-medium text-indigo-600 flex items-center gap-2 mb-3">
              <Users className="h-4 w-4" />
              Demographics
            </h5>
            <ul className="space-y-2">
              {targetMarket.demographics.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Psychographics */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 hover:border-indigo-100 transition-all">
            <h5 className="text-sm font-medium text-indigo-600 flex items-center gap-2 mb-3">
              <Target className="h-4 w-4" />
              Psychographics
            </h5>
            <ul className="space-y-2">
              {targetMarket.psychographics.map((item, index) => (
                <li key={index} className="flex items-center gap-2 text-gray-600 text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Market Size */}
          <div className="bg-white rounded-lg border border-gray-100 p-4 hover:border-indigo-100 transition-all">
            <h5 className="text-sm font-medium text-indigo-600 flex items-center gap-2 mb-3">
              <BarChart className="h-4 w-4" />
              Market Size
            </h5>
            <p className="text-gray-600 text-sm">
              {targetMarket.marketSize}
            </p>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl border border-gray-100 p-6">
        <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-5 w-5 text-indigo-600 mr-2" />
          Value Proposition
        </h4>
        <p className="text-gray-600">{valueProposition}</p>
      </div>
    </div>
  );
}

export default PlanOverview;