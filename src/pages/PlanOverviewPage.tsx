import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PlanOverview from '../components/roadmap/PlanOverview';
import { generateStartupPlanWithAI } from '../utils/api';
import type { StartupPlan } from '../types';

function PlanOverviewPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const idea = searchParams.get('idea');

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

  if (!plan) return null;

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/roadmap')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Roadmap</span>
      </button>

      <PlanOverview plan={plan} />
    </div>
  );
}

export default PlanOverviewPage; 