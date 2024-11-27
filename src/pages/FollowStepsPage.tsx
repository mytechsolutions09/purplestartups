import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Megaphone, Building, Wrench, Users } from 'lucide-react';
import Navbar from '../components/Navbar';
import { generateStartupPlanWithAI } from '../utils/api';
import type { StartupPlan } from '../types';

function FollowStepsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const idea = urlParams.get('idea');
  const [plan, setPlan] = useState<StartupPlan | null>(null);

  useEffect(() => {
    if (!idea) {
      navigate('/roadmap');
      return;
    }

    const loadPlan = async () => {
      try {
        const generatedPlan = await generateStartupPlanWithAI(idea);
        setPlan(generatedPlan);
      } catch (error) {
        console.error('Failed to load plan:', error);
      }
    };

    loadPlan();
  }, [idea, navigate]);

  const handleSelectPlan = (selectedPlan: StartupPlan) => {
    setPlan(selectedPlan);
    navigate(`/follow-steps?idea=${encodeURIComponent(selectedPlan.idea)}`);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const handleTechnologyClick = () => {
    console.log('Navigating to technology page with idea:', idea);
    navigate(`/technology?idea=${encodeURIComponent(idea || '')}`);
  };

  const handleRecruitmentClick = () => {
    navigate(`/recruitment?idea=${encodeURIComponent(idea || '')}`);
  };

  const handleMarketingClick = () => {
    navigate(`/marketing?idea=${encodeURIComponent(idea)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onSelectPlan={handleSelectPlan} />
      
      <div className="pt-16"> {/* Add padding-top to account for fixed navbar */}
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Back</span>
            </button>

            <div className="flex space-x-4">
              <button
                onClick={handleTechnologyClick}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Wrench className="h-5 w-5" />
                <span>Technology</span>
              </button>

              <button
                onClick={handleRecruitmentClick}
                className="flex items-center justify-center space-x-2 p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <Users className="h-6 w-6 text-indigo-600" />
                <span className="text-gray-700">Recruitment</span>
              </button>

              <button
                onClick={handleMarketingClick}
                className="flex items-center space-x-2 px-4 py-2 bg-white text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <Megaphone className="h-5 w-5" />
                <span>Marketing</span>
              </button>
            </div>
          </div>

          {plan && (
            <div className="space-y-8">
              <h1 className="text-3xl font-bold text-gray-900">{plan.idea}</h1>
              {/* Add your step-by-step implementation content here */}
              <div className="space-y-6">
                {plan.steps.map((step, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4">
                      Step {index + 1}: {step.title}
                    </h2>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FollowStepsPage; 