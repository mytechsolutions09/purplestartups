import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader, Save } from 'lucide-react';
import StepCard from './roadmap/StepCard';
import PlanOverview from './roadmap/PlanOverview';
import { generateStartupPlanWithAI } from '../utils/api';
import type { StartupPlan } from '../types';
import { useSavedPlans } from '../contexts/SavedPlansContext';

interface RoadmapViewProps {
  idea: string;
  onBack: () => void;
}

function RoadmapView({ idea, onBack }: RoadmapViewProps) {
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { savedPlans, savePlan } = useSavedPlans();

  useEffect(() => {
    const loadPlan = async () => {
      try {
        const generatedPlan = await generateStartupPlanWithAI(idea);
        setPlan(generatedPlan);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate plan');
      } finally {
        setIsLoading(false);
      }
    };

    loadPlan();
  }, [idea]);

  const handleSave = () => {
    if (!plan) return;
    
    // Check if plan is already saved
    const isAlreadySaved = savedPlans.some(
      savedPlan => savedPlan.idea === plan.idea
    );
    
    if (!isAlreadySaved) {
      const newSavedPlan = {
        id: crypto.randomUUID(),
        idea: plan.idea,
        timestamp: Date.now(),
        plan
      };
      
      savePlan(newSavedPlan);
      // Optional: Add a success notification here
      alert('Plan saved successfully!');
    } else {
      // Optional: Add a warning notification here
      alert('This plan is already saved!');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
          <p className="text-gray-600">Generating your startup plan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-red-50 rounded-lg text-red-700">
        <p>{error}</p>
        <button
          onClick={onBack}
          className="mt-4 text-red-600 hover:text-red-800 font-medium"
        >
          Go back and try again
        </button>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to ideas</span>
        </button>
        
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <Save className="h-5 w-5" />
          <span>Save Plan</span>
        </button>
      </div>

      <PlanOverview 
        idea={plan.idea}
        overview={plan.overview}
        problemStatement={plan.problemStatement}
        targetMarket={plan.targetMarket}
        valueProposition={plan.valueProposition}
      />

      <div className="space-y-8">
        {plan.steps.map((step, index) => (
          <StepCard
            key={index}
            step={step}
            stepNumber={index + 1}
          />
        ))}
      </div>
    </div>
  );
}

export default RoadmapView;