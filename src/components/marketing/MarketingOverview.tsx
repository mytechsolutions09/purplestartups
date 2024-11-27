import React from 'react';
import { Target, Users, TrendingUp, DollarSign } from 'lucide-react';
import type { MarketingStrategy } from '../../types';

interface MarketingOverviewProps {
  strategy: MarketingStrategy | null;
}

function MarketingOverview({ strategy }: MarketingOverviewProps) {
  if (!strategy) return null;

  return (
    <div className="space-y-8">
      {/* Strategy Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Target className="h-6 w-6 text-indigo-600" />}
          title="Target Audience"
          value={strategy.targetAudience?.size || '0'}
          subtitle="Potential customers"
        />
        <MetricCard
          icon={<Users className="h-6 w-6 text-green-600" />}
          title="Current Reach"
          value={strategy.currentReach || '0'}
          subtitle="Monthly impressions"
        />
        <MetricCard
          icon={<TrendingUp className="h-6 w-6 text-blue-600" />}
          title="Growth Rate"
          value={`${strategy.growthRate || '0'}%`}
          subtitle="Month over month"
        />
        <MetricCard
          icon={<DollarSign className="h-6 w-6 text-yellow-600" />}
          title="Marketing Budget"
          value={`$${strategy.budget || '0'}`}
          subtitle="Monthly allocation"
        />
      </div>

      {/* Marketing Objectives */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Marketing Objectives</h2>
        <div className="space-y-4">
          {strategy.objectives?.map((objective, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                {index + 1}
              </div>
              <div>
                <h3 className="font-medium">{objective.title}</h3>
                <p className="text-gray-600">{objective.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Marketing Channels */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Marketing Channels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {strategy.channels?.map((channel, index) => (
            <div key={index} className="border rounded-lg p-4">
              <h3 className="font-medium">{channel.name}</h3>
              <p className="text-gray-600 text-sm mt-1">{channel.description}</p>
              <div className="mt-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  Priority: {channel.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key Messages */}
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Key Messages</h2>
        <div className="space-y-4">
          {strategy.keyMessages?.map((message, index) => (
            <div key={index} className="border-l-4 border-indigo-500 pl-4">
              <p className="text-gray-800">{message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
}

function MetricCard({ icon, title, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white rounded-lg p-6">
      <div className="flex items-center space-x-3">
        {icon}
        <h3 className="text-gray-600">{title}</h3>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold">{value}</p>
        <p className="text-gray-500 text-sm">{subtitle}</p>
      </div>
    </div>
  );
}

export default MarketingOverview;