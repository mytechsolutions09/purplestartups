import React from 'react';
import { 
  Target, 
  Users, 
  Award, 
  TrendingUp, 
  Heart,
  Shield,
  Lightbulb,
  Globe
} from 'lucide-react';
import Navbar from '../components/Navbar';

const AboutPage: React.FC = () => {
  const stats = [
    { label: 'Startups Launched', value: '1000+' },
    { label: 'Success Rate', value: '85%' },
    { label: 'Countries', value: '50+' },
    { label: 'Team Members', value: '45' }
  ];

  const values = [
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We push the boundaries of what\'s possible with AI and startup creation.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building a supportive ecosystem of entrepreneurs and innovators.'
    },
    {
      icon: Shield,
      title: 'Trust',
      description: 'Maintaining the highest standards of security and reliability.'
    },
    {
      icon: Heart,
      title: 'Passion',
      description: 'Dedicated to helping entrepreneurs succeed in their ventures.'
    }
  ];

  const teamMembers = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      image: '/path/to/sarah.jpg',
      bio: 'Former startup founder with 15 years of experience in tech.'
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      image: '/path/to/michael.jpg',
      bio: 'AI researcher and engineer with multiple patents.'
    },
    {
      name: 'Elena Rodriguez',
      role: 'Head of Product',
      image: '/path/to/elena.jpg',
      bio: 'Product leader with experience at top tech companies.'
    },
    {
      name: 'David Kim',
      role: 'Head of AI',
      image: '/path/to/david.jpg',
      bio: 'PhD in Machine Learning, previously led AI teams at major tech firms.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 pt-20">
        {/* Hero Section */}
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Empowering the Next Generation of Startups
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              We're on a mission to democratize entrepreneurship through AI-powered insights and guidance.
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-indigo-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Story Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Story
            </h2>
            <div className="prose prose-lg mx-auto text-gray-600">
              <p>
                Founded in 2023, our platform emerged from a simple observation: starting a business 
                shouldn't be complicated. We saw countless brilliant ideas never making it past the 
                ideation phase due to lack of guidance and support.
              </p>
              <p>
                By combining cutting-edge AI technology with years of startup expertise, we've created 
                a platform that transforms vague concepts into actionable business plans. Our goal is 
                to empower entrepreneurs with the tools and insights they need to succeed.
              </p>
              <p>
                Today, we're proud to have helped thousands of entrepreneurs across the globe turn 
                their dreams into reality. But this is just the beginning of our journey.
              </p>
            </div>
          </div>

          {/* Values Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Our Values
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <value.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Team Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Meet Our Team
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="aspect-w-1 aspect-h-1">
                    <img 
                      src={member.image} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://via.placeholder.com/400x400?text=Photo';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {member.name}
                    </h3>
                    <p className="text-indigo-600 font-medium mb-2">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Join thousands of entrepreneurs who have already launched their startups with our platform.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 