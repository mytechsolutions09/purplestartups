import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target, Users, TrendingUp, Megaphone } from 'lucide-react';
import MarketingOverview from '../components/marketing/MarketingOverview';
import { useEffect, useState } from 'react';
import { getMarketingStrategy } from '../utils/api';
import type { MarketingStrategy } from '../types';

function MarketingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const idea = searchParams.get('idea');
  const [marketingStrategy, setMarketingStrategy] = useState<MarketingStrategy | null>(null);

  useEffect(() => {
    const loadMarketingStrategy = async () => {
      if (idea) {
        const strategy = await getMarketingStrategy(idea);
        setMarketingStrategy(strategy);
      }
    };

    loadMarketingStrategy();
  }, [idea]);

  const handleBack = () => {
    navigate(`/follow-steps?idea=${encodeURIComponent(idea || '')}`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Marketing Strategy & Implementation
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-3xl mx-auto">
              Develop a comprehensive marketing plan to reach your target audience and grow your business
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-indigo-600" />
            Marketing Strategy
          </h2>
          <MarketingOverview strategy={marketingStrategy} />
        </div>
      </div>
    </div>
  );
}

export default MarketingPage;
