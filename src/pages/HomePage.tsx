import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Rocket, 
  Brain, 
  TrendingUp, 
  Target, 
  Shield, 
  Clock,
  ArrowRight
} from 'lucide-react';

function HomePage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="h-6 w-6" />,
      title: 'AI-Powered Analysis',
      description: 'Leverage advanced AI to analyze your startup idea and generate comprehensive business plans.'
    },
    {
      icon: <TrendingUp className="h-6 w-6" />,
      title: 'Market Insights',
      description: 'Get detailed market analysis and growth projections based on current industry trends.'
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: 'Strategic Planning',
      description: 'Receive step-by-step guidance on implementing your business strategy effectively.'
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Risk Assessment',
      description: 'Identify potential challenges and get recommendations for risk mitigation.'
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: 'Timeline Generation',
      description: 'Get realistic timelines and milestones for your startup journey.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6">
              Transform Your Startup Idea Into Reality
            </h1>
            <p className="text-xl sm:text-2xl mb-8 text-indigo-100">
              Get AI-powered insights and step-by-step guidance to build your successful startup
            </p>
            <button
              onClick={() => navigate('/roadmap')}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150"
            >
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Everything You Need to Launch Your Startup
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Our comprehensive toolkit helps you navigate every aspect of your startup journey
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative p-6 bg-white rounded-lg border border-gray-200 hover:border-indigo-500 transition-colors duration-200"
              >
                <div className="inline-flex items-center justify-center p-2 bg-indigo-100 rounded-lg text-indigo-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="bg-indigo-600 rounded-2xl shadow-xl overflow-hidden">
            <div className="pt-16 pb-12 px-6 sm:pt-20 sm:px-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20">
              <div className="lg:self-center">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  <span className="block">Ready to start your journey?</span>
                </h2>
                <p className="mt-4 text-lg leading-6 text-indigo-200">
                  Get your personalized startup roadmap in minutes. No credit card required.
                </p>
                <button
                  onClick={() => navigate('/roadmap')}
                  className="mt-8 bg-white border border-transparent rounded-md shadow px-6 py-3 inline-flex items-center text-base font-medium text-indigo-600 hover:bg-indigo-50 transition-colors duration-150"
                >
                  Start Building Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-white py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-lg font-semibold text-indigo-600">Trusted by Entrepreneurs</h2>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              Join thousands of founders who've launched successful startups
            </p>
            <div className="mt-8 flex justify-center space-x-6">
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">1000+</p>
                <p className="mt-2 text-lg text-gray-600">Startups Launched</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">95%</p>
                <p className="mt-2 text-lg text-gray-600">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold text-indigo-600">24/7</p>
                <p className="mt-2 text-lg text-gray-600">AI Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage; 