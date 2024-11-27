import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../components/PageWrapper';

export default function TermsAndConditions() {
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

        <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
        
        <div className="prose prose-indigo max-w-none">
          <p className="text-gray-600 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">1. Agreement to Terms</h2>
            <p className="mb-4">
              By accessing our service, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">2. Use License</h2>
            <p className="mb-4">
              Permission is granted to temporarily access the materials (information or software) on our website for personal, non-commercial transitory viewing only.
            </p>
            <p className="mb-4">This license shall automatically terminate if you violate any of these restrictions and may be terminated by us at any time.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">3. User Account</h2>
            <p className="mb-4">
              To access certain features of our service, you may be required to create an account. You agree to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate and complete information</li>
              <li>Maintain and update your information</li>
              <li>Keep your password secure</li>
              <li>Be responsible for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">4. Service Modifications</h2>
            <p className="mb-4">
              We reserve the right to modify or discontinue, temporarily or permanently, the service with or without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">5. Intellectual Property</h2>
            <p className="mb-4">
              The service and its original content, features, and functionality are owned by us and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
            <p className="mb-4">
              In no event shall we be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">7. Governing Law</h2>
            <p className="mb-4">
              These Terms shall be governed and construed in accordance with the laws of [Your Country/State], without regard to its conflict of law provisions.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">8. Changes to Terms</h2>
            <p className="mb-4">
              We reserve the right to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
            <p className="mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="mb-4">
              Email: legal@yourcompany.com<br />
              Address: Your Company Address
            </p>
          </section>
        </div>
      </div>
    </PageWrapper>
  );
} 