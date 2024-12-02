import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Check, 
  HelpCircle, 
  X,
  Zap,
  Star,
  Award,
  Users,
  ArrowRight
} from 'lucide-react';

const PricingPage: React.FC = () => {
  const [isAnnual, setIsAnnual] = useState(true);

  const features = {
    basic: [
      'AI Startup Generator',
      'Basic Business Plan Templates',
      'Market Research Tools',
      'Email Support',
      '1 User',
      '2 Projects per month',
      'Community Access'
    ],
    pro: [
      'Everything in Basic, plus:',
      'Advanced AI Analysis',
      'Custom Business Plans',
      'Financial Projections',
      'Priority Support',
      '2 Team Members',
      '10 Projects',
      'Custom Branding'
    ],
    enterprise: [
      'Everything in Pro, plus:',
      '50 Projects',
      'Dedicated Account Manager',
      'Custom AI Models',
      'Enterprise Analytics',
      'SLA Support',
      'Unlimited Team Members',
      'White Label Options',
      'Custom Integrations',
      'Training Sessions'
    ]
  };

  const plans = [
    {
      name: 'Basic',
      icon: Zap,
      description: 'For solo entrepreneurs and Startups',
      monthlyPrice: 0,
      annualPrice: 0,
      features: features.basic,
      popular: false,
      buttonText: 'Get Started'
    },
    {
      name: 'Pro',
      icon: Star,
      description: 'Ideal for growing businesses and teams',
      monthlyPrice: 19.99,
      annualPrice: 199.99,
      features: features.pro,
      popular: true,
      buttonText: 'Start Free Trial'
    },
    {
      name: 'Enterprise',
      icon: Award,
      description: 'For large organizations and agencies',
      monthlyPrice: 49.99,
      annualPrice: 499.99,
      features: features.enterprise,
      popular: false,
      buttonText: 'Contact Sales'
    }
  ];

  const faqs = [
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards, PayPal, and bank transfers for annual plans.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.'
    },
    {
      question: 'Is there a free trial?',
      answer: 'Yes, we offer a 14-day free trial on our Pro plan with no credit card required.'
    },
    {
      question: 'What happens after my trial ends?',
      answer: 'You can choose to subscribe to continue using the platform or downgrade to our Basic plan.'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar onSelectPlan={() => {}} />
      
      <div className="flex-1 pt-20">
        {/* Header */}
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Choose the Right Plan for Your Business
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              All plans include our core features. Upgrade or downgrade at any time.
            </p>

            {/* Pricing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={`text-lg ${!isAnnual ? 'text-white' : 'text-indigo-200'}`}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-400"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    isAnnual ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className={`text-lg ${isAnnual ? 'text-white' : 'text-indigo-200'}`}>
                Annual                   </span>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative bg-white rounded-2xl shadow-xl p-8 flex flex-col ${
                  plan.popular ? 'ring-2 ring-indigo-600' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-sm font-semibold bg-indigo-600 text-white">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {plan.name}
                    </h2>
                    <p className="text-gray-500 mt-1">
                      {plan.description}
                    </p>
                  </div>
                  <div className="p-2 bg-indigo-50 rounded-lg">
                    <plan.icon className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <div className="mb-8 min-h-[120px]">
                  <div className="flex items-baseline gap-x-1 h-[60px]">
                    <span className="text-3xl font-bold text-gray-900">
                      {plan.monthlyPrice === 0 ? 'Free' : (
                        <>
                          <span className="text-3xl">$</span>
                          {isAnnual 
                            ? (plan.annualPrice / 12).toFixed(2)
                            : plan.monthlyPrice.toFixed(2)
                          }
                        </>
                      )}
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <p className="text-gray-500 h-[24px]">
                      {plan.monthlyPrice === 0 
                        ? 'forever'
                        : `per month, billed ${isAnnual ? 'annually' : 'monthly'}`
                      }
                    </p>
                    {isAnnual && plan.monthlyPrice > 0 && (
                      <p className="text-sm text-green-600 h-[20px]">
                        Save ${(plan.monthlyPrice * 12 - plan.annualPrice).toFixed(2)} annually
                      </p>
                    )}
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto">
                  <button
                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                      plan.popular
                        ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                        : plan.monthlyPrice === 0
                        ? 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
                        : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                    }`}
                  >
                    {plan.buttonText}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feature Comparison */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Compare Plans
            </h2>
            {/* Add feature comparison table here */}
          </div>

          {/* FAQs */}
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-16 bg-indigo-50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Need Help Choosing?
            </h2>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect plan for your business.
            </p>
            <button className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors">
              Schedule a Demo
              <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PricingPage; 