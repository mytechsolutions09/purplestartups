import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back</span>
        </button>

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-indigo max-w-none">
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
            <p className="mb-4">
              We collect information that you provide directly to us, including when you:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Create an account</li>
              <li>Use our services</li>
              <li>Contact our support team</li>
              <li>Subscribe to our newsletters</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
            <p className="mb-4">
              We use the information we collect to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide and improve our services</li>
              <li>Send you technical notices and updates</li>
              <li>Respond to your comments and questions</li>
              <li>Analyze usage patterns</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
            <p className="mb-4">
              We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
            <p className="mb-4">
              We implement appropriate technical and organizational measures to maintain the security of your personal information.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
            <p className="mb-4">
              You have the right to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access your personal information</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to our use of your data</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
            <p className="mb-4">
              If you have any questions about this Privacy Policy, please contact us at:
            </p>
            <p className="mb-4">
              Email: privacy@yourcompany.com<br />
              Address: Your Company Address
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
} 