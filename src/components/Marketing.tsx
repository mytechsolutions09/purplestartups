import React from 'react';
import { DollarSign, Target, Clock, Megaphone } from 'lucide-react';
import type { MarketingStrategy } from '../types';

interface MarketingProps {
  strategy: MarketingStrategy;
}

interface TimelineStep {
  title: string;
  duration: string;
  tasks: string[];
}

function Marketing({ strategy }: MarketingProps) {
  const timelineSteps: TimelineStep[] = [
    {
      title: "Launch & Awareness",
      duration: "3 months",
      tasks: [
        "Create marketing materials",
        "Launch digital advertising campaigns",
        "Publish informative content"
      ]
    },
    {
      title: "Lead Generation & Conversion",
      duration: "6 months",
      tasks: [
        "Run email campaigns",
        "Participate in industry events",
        "Host webinars"
      ]
    },
    {
      title: "Expansion & Retention",
      duration: "Ongoing",
      tasks: [
        "Nurture customer relationships",
        "Collect and analyze customer feedback",
        "Expand customer base"
      ]
    }
  ];

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-6"></h2>
        
        {/* Marketing Channels */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Marketing Channels</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {strategy.channels.map((channel, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{channel.name}</h4>
                  <span className={`px-2 py-1 rounded text-sm ${
                    channel.priority === 'high' ? 'bg-red-100 text-red-800' :
                    channel.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {channel.priority}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{channel.description}</p>
                <div className="text-sm text-gray-500">
                  <p>Budget: {channel.estimatedBudget}</p>
                  <p>Expected ROI: {channel.expectedROI}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        

        {/* KPIs */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4">Key Performance Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {strategy.kpis.map((kpi, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-4">
                <Target className="w-5 h-5 text-indigo-600 mb-2" />
                <h4 className="font-semibold">{kpi.metric}</h4>
                <p className="text-sm text-gray-600">Target: {kpi.target}</p>
                <p className="text-sm text-gray-600">Timeframe: {kpi.timeframe}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Budget Allocation */}
        <div>
          <h3 className="text-xl font-semibold mb-4">Budget Allocation</h3>
          <p className="text-lg font-medium mb-4">
            Total Budget: {strategy.budgetAllocation.total}
          </p>
          <div className="space-y-2">
            {strategy.budgetAllocation.breakdown.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span>{item.category}</span>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-600">{item.percentage}%</span>
                  <span className="font-medium">{item.amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Marketing; 