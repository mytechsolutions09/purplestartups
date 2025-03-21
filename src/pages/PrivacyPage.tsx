import React from 'react';
import { Shield, Lock, Eye, Database, Share2, Bell } from 'lucide-react';

const PrivacyPage: React.FC = () => {
  const sections = [
    {
      id: 'information-collection',
      icon: Database,
      title: 'Information Collection',
      content: [
        'We collect information that you provide directly to us, including:',
        '• Name and contact information when you create an account',
        '• Payment information when you subscribe to our services',
        '• Business information when using our platform',
        '• Communications you send to us',
        'We also automatically collect certain information about your device and how you interact with our platform.'
      ]
    },
    {
      id: 'information-use',
      icon: Eye,
      title: 'How We Use Your Information',
      content: [
        'We use the information we collect to:',
        '• Provide and improve our services',
        '• Process your payments and transactions',
        '• Send you updates and marketing communications',
        '• Protect against fraudulent or illegal activity',
        '• Comply with our legal obligations'
      ]
    },
    {
      id: 'information-sharing',
      icon: Share2,
      title: 'Information Sharing',
      content: [
        'We may share your information with:',
        '• Service providers who assist in our operations',
        '• Professional advisors and auditors',
        '• Law enforcement when required by law',
        '• Other parties with your consent',
        'We never sell your personal information to third parties.'
      ]
    },
    {
      id: 'data-security',
      icon: Shield,
      title: 'Data Security',
      content: [
        'We implement appropriate security measures including:',
        '• Encryption of sensitive information',
        '• Regular security assessments',
        '• Access controls and authentication',
        '• Secure data storage practices',
        '• Regular security training for our team'
      ]
    },
    {
      id: 'your-rights',
      icon: Lock,
      title: 'Your Rights and Choices',
      content: [
        'You have the right to:',
        '• Access your personal information',
        '• Correct inaccurate information',
        '• Request deletion of your information',
        '• Opt-out of marketing communications',
        '• Control cookie preferences'
      ]
    },
    {
      id: 'updates',
      icon: Bell,
      title: 'Updates to This Policy',
      content: [
        'We may update this privacy policy from time to time. We will notify you of any material changes by:',
        '• Posting the new policy on our website',
        '• Sending you an email notification',
        '• Displaying a notice in your account',
        'Your continued use of our services after changes indicates acceptance of the updated policy.'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg text-indigo-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              At Startup Guru, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you use our platform. Please read this 
              privacy policy carefully. If you do not agree with the terms of this privacy policy, please 
              do not access the platform.
            </p>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center mb-6">
                  <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                    <section.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((paragraph, index) => (
                    <p key={index} className="text-gray-600">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 bg-indigo-50 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                Email: privacy@startupguru.com
              </p>
              <p className="text-gray-600">
                Address: 123 Privacy Street, Tech City, TC 12345
              </p>
              <p className="text-gray-600">
                Phone: (555) 123-4567
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage; 