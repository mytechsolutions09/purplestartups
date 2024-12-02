import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Book, 
  Video, 
  FileText,
  Sparkles,
  Search
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const HelpPage: React.FC = () => {
  const navigate = useNavigate();

  const helpSections = [
    {
      icon: Book,
      title: "Getting Started",
      description: "Learn the basics of using our platform to generate and develop your startup ideas.",
      items: [
        "How to generate your first idea",
        "Understanding your roadmap",
        "Saving and managing plans",
        "Navigating the dashboard"
      ]
    },
    {
      icon: FileText,
      title: "Frequently Asked Questions",
      description: "Find answers to common questions about our platform and features.",
      items: [
        "How does the AI idea generation work?",
        "Can I modify my roadmap?",
        "How accurate are the market analyses?",
        "What's included in the free tier?"
      ]
    },
    {
      icon: MessageCircle,
      title: "Support Channels",
      description: "Different ways to get help and connect with our support team.",
      items: [
        "24/7 Chat Support",
        "Email Support",
        "Community Forum",
        "Schedule a Call"
      ]
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Watch step-by-step guides on using platform features.",
      items: [
        "Platform Overview",
        "Advanced Features",
        "Tips & Tricks",
        "Success Stories"
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onSelectPlan={() => {}} />
      
      {/* Hero Section */}
      <div className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              How can we help you?
            </h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Find answers to common questions, explore our guides, or reach out to our support team.
            </p>
            
            {/* Search Bar */}
            <div className="mt-8 max-w-xl mx-auto">
              <div className="flex items-center bg-white rounded-lg shadow-sm">
                <div className="px-4">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search for help articles..."
                  className="flex-1 py-3 px-4 block w-full border-0 focus:ring-0 text-gray-900 rounded-r-lg"
                />
              </div>
              <div className="mt-3 text-sm text-indigo-100">
                Popular searches: Getting Started, Pricing, Account Settings
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Sections Grid */}
      <div className="flex-1 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {helpSections.map((section, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center space-x-4 mb-4">
                  <div className="p-2 bg-indigo-100 rounded-lg">
                    <section.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {section.title}
                  </h3>
                </div>
                <p className="text-gray-600 mb-4">
                  {section.description}
                </p>
                <ul className="space-y-2">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-gray-700 hover:text-indigo-600 cursor-pointer">
                      <span className="mr-2">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Contact Support Section */}
          <div className="bg-indigo-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Still Need Help?
            </h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to assist you with any questions or concerns
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => window.location.href = 'mailto:support@example.com'}
                className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-50 transition-colors border border-indigo-200"
              >
                <Mail className="w-5 h-5 mr-2" />
                Email Support
              </button>
              <button
                onClick={() => {/* Add chat functionality */}}
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                Start Chat
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default HelpPage; 