import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Brain, Rocket, Target, Clock, Shield, Code } from 'lucide-react';
import Navbar from '../components/Navbar';

const FeaturesPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Idea Generation",
      description: "Transform vague concepts into concrete business ideas using advanced AI algorithms that analyze market trends and opportunities."
    },
    {
      icon: Rocket,
      title: "Comprehensive Roadmap Creation",
      description: "Get detailed, step-by-step roadmaps customized to your business idea, including market analysis, competitor research, and execution strategy."
    },
    {
      icon: Target,
      title: "Market Analysis",
      description: "Access in-depth market research, target audience insights, and growth potential analysis for your business concept."
    },
    {
      icon: Clock,
      title: "Timeline Planning",
      description: "Receive realistic timelines and milestones for your startup journey, from ideation to launch and beyond."
    },
    {
      icon: Shield,
      title: "Risk Assessment",
      description: "Identify potential challenges and risks early with our comprehensive risk analysis and mitigation strategies."
    },
    {
      icon: Code,
      title: "Website Generation",
      description: "Generate detailed website requirements and design specifications tailored to your startup's needs."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
            <div className="text-center mt-10">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Powerful Features to Build Your Startup
              </h2>
              <p className="mt-4 text-lg text-white max-w-2xl mx-auto">
                Everything you need to validate your ideas and turn them into successful businesses.
              </p>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <feature.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Your Startup Idea
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage; 