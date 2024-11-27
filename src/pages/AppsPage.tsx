import React from 'react';
import { ArrowRight, FileText, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function AppsPage() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <Navbar onSelectPlan={handleSelectPlan} />

      {/* Add margin-top to account for fixed navbar */}
      <div className="pt-16">
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
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition-all">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Tender AI</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <FileText className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Automated requirement extraction from PDF, DOCX, and PPTX files</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <Users className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Collaborative workflow with team assignment features</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Smart compliance scoring and response generation</p>
                  </div>
                </div>

                <button
                  onClick={() => navigate('/apps/tender-ai')}
                  className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppsPage; 