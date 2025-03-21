import React from 'react';
import { 
  Cookie, 
  Shield, 
  Settings, 
  Clock,
  Globe,
  ToggleLeft,
  Info,
  AlertCircle
} from 'lucide-react';

const CookiesPage: React.FC = () => {
  const sections = [
    {
      id: 'what-are-cookies',
      icon: Cookie,
      title: 'What Are Cookies',
      content: [
        'Cookies are small text files that are placed on your device when you visit our website. They help us:',
        '• Remember your preferences and settings',
        '• Understand how you use our platform',
        '• Improve your experience',
        '• Provide personalized content and ads',
        'Cookies can be "persistent" or "session" cookies. Persistent cookies remain on your device after you close your browser, while session cookies are deleted when you close your browser.'
      ]
    },
    {
      id: 'types-of-cookies',
      icon: Settings,
      title: 'Types of Cookies We Use',
      content: [
        '1. Essential Cookies:',
        '• Required for the platform to function',
        '• Cannot be disabled',
        '• Handle authentication and security',
        '',
        '2. Functional Cookies:',
        '• Remember your preferences',
        '• Customize your experience',
        '• Store language settings',
        '',
        '3. Analytics Cookies:',
        '• Track platform usage',
        '• Help us improve performance',
        '• Measure effectiveness of features',
        '',
        '4. Marketing Cookies:',
        '• Display relevant advertisements',
        '• Track marketing campaign performance',
        '• Measure conversion rates'
      ]
    },
    {
      id: 'third-party',
      icon: Globe,
      title: 'Third-Party Cookies',
      content: [
        'We use services from these third parties that may set cookies:',
        '• Google Analytics - Usage analysis',
        '• Facebook Pixel - Marketing tracking',
        '• Stripe - Payment processing',
        '• Intercom - Customer support',
        'These third parties have their own privacy and cookie policies.'
      ]
    },
    {
      id: 'cookie-duration',
      icon: Clock,
      title: 'Cookie Duration',
      content: [
        'Cookies we use last for different periods:',
        '• Session Cookies: Deleted when you close your browser',
        '• Persistent Cookies: Last up to 2 years',
        '• Authentication Cookies: 30 days',
        '• Preference Cookies: 1 year',
        'You can manually delete cookies at any time through your browser settings.'
      ]
    },
    {
      id: 'managing-cookies',
      icon: ToggleLeft,
      title: 'Managing Your Cookie Preferences',
      content: [
        'You can control cookies through:',
        '• Browser settings',
        '• Our cookie consent tool',
        '• Third-party opt-out tools',
        'Note: Disabling certain cookies may limit your ability to use some features of our platform.'
      ]
    },
    {
      id: 'data-protection',
      icon: Shield,
      title: 'Data Protection',
      content: [
        'We protect cookie data by:',
        '• Using encryption',
        '• Limiting access to authorized personnel',
        '• Regular security audits',
        '• Compliance with data protection laws',
        'We never sell cookie data to third parties.'
      ]
    },
    {
      id: 'updates',
      icon: AlertCircle,
      title: 'Updates to This Policy',
      content: [
        'We may update this Cookie Policy to reflect:',
        '• Changes in our practices',
        '• New regulatory requirements',
        '• Technology improvements',
        'We will notify you of significant changes through our platform.'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Cookie Policy
            </h1>
            <p className="text-lg text-indigo-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              This Cookie Policy explains how Startup Guru uses cookies and similar technologies 
              to recognize you when you visit our platform. It explains what these technologies 
              are and why we use them, as well as your rights to control our use of them.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <div className="flex items-center mb-4">
              <Info className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">
                Cookie Consent Banner Example
              </h2>
            </div>
            <div className="bg-gray-100 p-4 rounded-lg">
              <p className="text-gray-600 mb-4">
                We use cookies to enhance your experience on our platform. By continuing to browse, 
                you agree to our use of cookies. You can manage your preferences at any time.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  Accept All
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Manage Preferences
                </button>
                <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Reject All
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <div 
                key={section.id} 
                id={section.id} 
                className="bg-white rounded-xl shadow-md p-6"
              >
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
              Questions About Cookies?
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about our use of cookies, please contact us at:
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

export default CookiesPage; 