import React from 'react';
import { ArrowRight, MessageCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function AppsPage() {
  const navigate = useNavigate();

  const handleSelectPlan = (plan: any) => {
    console.log('Selected plan:', plan);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar onSelectPlan={handleSelectPlan} />
      
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white">
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

        {/* Apps Grid Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            
          </div>
          
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Social Media Posts Card */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:border-indigo-500 transition-all">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Social Media Manager</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-start space-x-3">
                    <MessageCircle className="w-5 h-5 text-indigo-600 mt-1" />
                    <p className="text-gray-600">Post effortlessly to multiple platforms:</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {[
                      'Twitter',
                      'Facebook',
                      'LinkedIn',
                      'Instagram',
                      'TikTok',
                      'Pinterest',
                      'YouTube',
                      'Threads'
                    ].map((platform) => (
                      <span 
                        key={platform}
                        className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-sm font-medium"
                      >
                        {platform}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-600">AI-powered content generation for each platform</p>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                    <p className="text-gray-600">Schedule and automate your posts</p>
                  </div>
                </div>
                
                <div className="h-[40px] flex items-center">
                  <button
                    onClick={() => navigate('/social-media-posts')}
                    className="w-full flex items-center justify-center space-x-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <span>Create Posts</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default AppsPage; 