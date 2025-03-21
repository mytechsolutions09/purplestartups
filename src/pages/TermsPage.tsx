import React from 'react';
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  UserX, 
  Scale,
  DollarSign,
  Copyright,
  MessageSquare
} from 'lucide-react';

const TermsPage: React.FC = () => {
  const sections = [
    {
      id: 'acceptance',
      icon: FileText,
      title: 'Acceptance of Terms',
      content: [
        'By accessing and using Startup Guru, you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, you must not use our platform.',
        'We reserve the right to modify these terms at any time. Your continued use of the platform following any changes indicates your acceptance of the modified terms.'
      ]
    },
    {
      id: 'account',
      icon: Shield,
      title: 'Account Responsibilities',
      content: [
        'You are responsible for:',
        '• Maintaining the confidentiality of your account',
        '• All activities that occur under your account',
        '• Providing accurate and complete information',
        '• Updating your information as needed',
        '• Notifying us of any unauthorized access'
      ]
    },
    {
      id: 'prohibited',
      icon: AlertTriangle,
      title: 'Prohibited Activities',
      content: [
        'You agree not to:',
        '• Violate any laws or regulations',
        '• Infringe on intellectual property rights',
        '• Upload malicious code or content',
        '• Attempt to gain unauthorized access',
        '• Use the platform for illegal purposes',
        '• Harass or harm other users'
      ]
    },
    {
      id: 'termination',
      icon: UserX,
      title: 'Account Termination',
      content: [
        'We may terminate or suspend your account if you:',
        '• Violate these terms',
        '• Provide false information',
        '• Engage in prohibited activities',
        '• Fail to pay applicable fees',
        'We reserve the right to terminate any account without notice.'
      ]
    },
    {
      id: 'intellectual',
      icon: Copyright,
      title: 'Intellectual Property',
      content: [
        'All content on the platform, including:',
        '• Text, graphics, and logos',
        '• Software and technology',
        '• AI-generated content and analyses',
        '• User interface and design',
        'is the property of Startup Guru and protected by intellectual property laws.'
      ]
    },
    {
      id: 'payment',
      icon: DollarSign,
      title: 'Payment Terms',
      content: [
        'By subscribing to our services:',
        '• You agree to pay all applicable fees',
        '• Fees are non-refundable unless stated otherwise',
        '• We may modify pricing with notice',
        '• Subscription renewals are automatic',
        '• You may cancel at any time'
      ]
    },
    {
      id: 'liability',
      icon: Scale,
      title: 'Limitation of Liability',
      content: [
        'Startup Guru is not liable for:',
        '• Business decisions made using our platform',
        '• Indirect or consequential damages',
        '• Loss of profits or data',
        '• Service interruptions',
        '• Third-party actions'
      ]
    },
    {
      id: 'disputes',
      icon: MessageSquare,
      title: 'Dispute Resolution',
      content: [
        'Any disputes shall be resolved:',
        '• Through good faith negotiations',
        '• By binding arbitration if necessary',
        '• Under the laws of [Your Jurisdiction]',
        '• In the courts of [Your Jurisdiction]',
        'Class action waiver applies.'
      ]
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Terms of Service
            </h1>
            <p className="text-lg text-indigo-100">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="prose prose-lg max-w-none mb-12">
            <p>
              These Terms of Service ("Terms") govern your access to and use of Startup Guru's platform, 
              services, and features. Please read these Terms carefully before using our platform. By 
              using Startup Guru, you agree to be bound by these Terms.
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Table of Contents
            </h2>
            <nav className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="text-indigo-600 hover:text-indigo-700 flex items-center"
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.title}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-12">
            {sections.map((section) => (
              <div 
                key={section.id} 
                id={section.id} 
                className="bg-white rounded-xl shadow-md p-6 scroll-mt-24"
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
              Contact Us
            </h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about these Terms, please contact us at:
            </p>
            <div className="space-y-2">
              <p className="text-gray-600">
                Email: legal@startupguru.com
              </p>
              <p className="text-gray-600">
                Address: 123 Legal Street, Tech City, TC 12345
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

export default TermsPage; 