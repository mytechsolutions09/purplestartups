import React from 'react';
import { ArrowRight, FileText, Users, CheckCircle, TrendingUp, Globe } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getPredictedTrendingKeywords } from '../utils/api';
import type { TrendingKeyword } from '../utils/api';
import Footer from '../components/Footer';

function AppsPage() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar onSelectPlan={handleSelectPlan} />

      {/* Main content - Add flex-grow to push footer to bottom */}
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
            <div className="text-center">
              <h1 className="text-4xl sm:text-6xl font-bold mb-6">
                Startup Tools & Applications
              </h1>
              <p className="text-xl sm:text-2xl mb-8 text-indigo-100 max-w-3xl mx-auto">
                Access our suite of powerful tools designed to help you build, launch, and grow your startup
              </p>
            </div>
          </div>
        </div>

        {/* Apps Grid Section - Placeholder */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              Available Applications
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Choose from our collection of startup tools and resources
            </p>
          </div>
          
          {/* Add your apps grid here */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Tender AI Card */}
            

            {/* New Trending Keywords Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition-all">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Trend Predictor AI</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Predict upcoming business trends and keywords</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Globe className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Analysis based on global events and market data</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Real-time trend scoring and growth predictions</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/apps/trend-predictor')}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <span>Analyze Trends</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Footer component */}
      <Footer />
    </div>
  );
}

export default AppsPage; 