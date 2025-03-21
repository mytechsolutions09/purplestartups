import React, { useEffect, useState } from 'react';
import { useParams, Navigate, useNavigate, Link } from 'react-router-dom';
import RoadmapView from '../components/RoadmapView';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import { Loader, AlertTriangle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const RoadmapPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { savedPlans, getPlanById, isLoading: plansLoading } = useSavedPlans();
  const { user, loading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [savedPlan, setSavedPlan] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!authLoading && !plansLoading) {
      if (!user) {
        navigate('/login');
        return;
      }
      
      if (id) {
        console.log('Attempting to find plan with ID:', id);
        console.log('Current savedPlans array:', savedPlans);
        
        const plan = getPlanById(id);
        console.log('Result from getPlanById:', plan);
        
        if (plan) {
          console.log('Found plan with raw data structure:', plan);
          
          // Extract all sections from plan_data more carefully
          const adaptedPlan = {
            ...plan,
            plan: plan.plan_data?.plan || plan.plan,
            marketMetrics: plan.plan_data?.marketMetrics,
            competitors: plan.plan_data?.competitors,
            riskAssessment: plan.plan_data?.riskAssessment,
            researchData: plan.plan_data?.researchData,
            marketingStrategy: plan.plan_data?.marketingStrategy,
            websitePrompt: plan.plan_data?.websitePrompt
          };
          
          console.log('Adapted plan with all sections:', adaptedPlan);
          setSavedPlan(adaptedPlan);
          setNotFound(false);
        } else {
          console.log(`Plan with ID ${id} not found`);
          setNotFound(true);
        }
      }
      setIsLoading(false);
    }
  }, [id, authLoading, plansLoading, user, getPlanById, navigate]);

  const handleBack = () => {
    navigate('/dashboard/saved-ideas');
  };

  // Show loading state
  if (authLoading || plansLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-8 w-8 text-indigo-600 animate-spin mx-auto" />
          <p className="mt-4 text-gray-600">Loading your roadmap...</p>
        </div>
      </div>
    );
  }

  // Show not found state
  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Roadmap Not Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the roadmap you're looking for. It may have been deleted or you may have used an invalid link.
          </p>
          <Link 
            to="/dashboard/saved-ideas"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Saved Ideas
          </Link>
        </div>
      </div>
    );
  }

  // Pass the full saved plan data to RoadmapView as a prop
  return savedPlan ? (
    <RoadmapView 
      idea={savedPlan.idea}
      onBack={handleBack}
      savedPlanData={savedPlan} 
    />
  ) : null;
};

export default RoadmapPage; 