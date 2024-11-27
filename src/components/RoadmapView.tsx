import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader, Save, Layout, BarChart, Calculator, GitBranch, Shield, AlertTriangle, TrendingDown, Building, Tool, Microscope, TrendingUp, Megaphone } from 'lucide-react';
import StepCard from './roadmap/StepCard';
import PlanOverview from './roadmap/PlanOverview';
import { generateStartupPlanWithAI } from '../utils/api';
import type { StartupPlan } from '../types';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import MarketAnalysis from './MarketAnalysis';
import { getMarketAnalysis } from '../utils/api';
import FinancialProjections from './FinancialProjections';
import CompetitorAnalysis from './CompetitorAnalysis';
import TimelineGenerator from './TimelineGenerator';
import { getCompetitorAnalysis } from '../utils/api';
import type { Competitor, Milestone } from '../types';
import RiskAssessment from './RiskAssessment';
import { generateRiskAssessment } from '../utils/api';
import type { RiskAssessment as RiskAssessmentType } from '../types';
import ResearchAndDevelopment from './ResearchAndDevelopment';
import { getResearchAndDevelopment } from '../utils/api';
import type { ResearchProject, TechnologyTrend } from '../types';
import TechnologyTrends from './TechnologyTrends';
import Marketing from './Marketing';
import { getMarketingStrategy } from '../utils/api';
import { useNavigate } from 'react-router-dom';

interface RoadmapViewProps {
  idea: string;
  onBack: () => void;
}

function RoadmapView({ idea, onBack }: RoadmapViewProps) {
  const navigate = useNavigate();
  // State management for different sections of the roadmap
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [marketMetrics, setMarketMetrics] = useState<MarketMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { savedPlans, savePlan } = useSavedPlans();
  
  // Track which section is currently active for navigation
  const [activeSection, setActiveSection] = useState('overview');
  
  // Refs for scroll behavior and section tracking
  const contentRef = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [riskAssessment, setRiskAssessment] = useState<RiskAssessmentType | null>(null);
  const [researchData, setResearchData] = useState<{
    projects: ResearchProject[];
    trends: TechnologyTrend[];
  } | null>(null);
  const [marketingStrategy, setMarketingStrategy] = useState<MarketingStrategy | null>(null);
  const hasSavedRef = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // Parallel loading of all roadmap sections
        const [generatedPlan, analysis, competitorData, risks, rdData, marketing] = await Promise.all([
          generateStartupPlanWithAI(idea),
          getMarketAnalysis(idea),
          getCompetitorAnalysis(idea),
          generateRiskAssessment(idea),
          getResearchAndDevelopment(idea),
          getMarketingStrategy(idea)
        ]);

        // Update all section states
        setPlan(generatedPlan);
        setMarketMetrics(analysis);
        setCompetitors(competitorData);
        setRiskAssessment(risks);
        setResearchData(rdData);
        setMarketingStrategy(marketing);

        // Save plan if not already saved
        if (!hasSavedRef.current) {
          const isAlreadySaved = savedPlans.some(
            savedPlan => savedPlan.idea === generatedPlan.idea
          );
          
          if (!isAlreadySaved) {
            const newSavedPlan = {
              id: crypto.randomUUID(),
              idea: generatedPlan.idea,
              timestamp: Date.now(),
              plan: generatedPlan
            };
            
            savePlan(newSavedPlan);
          }
          hasSavedRef.current = true;
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to generate plan');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [idea, savePlan]);

  // Smooth scroll handler for navigation
  const scrollToSection = (sectionId: string) => {
    contentRef.current[sectionId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setActiveSection(sectionId);
  };

  const handleFollowSteps = () => {
    navigate(`/follow-steps?idea=${encodeURIComponent(idea)}`);
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
    <div className="space-y-8 pb-16">
      <div className="sticky top-16 z-30 bg-gray-50 pb-4">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to ideas</span>
          </button>
          
          <button
            onClick={handleFollowSteps}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <GitBranch className="h-5 w-5" />
            <span>Follow Steps</span>
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <button
            onClick={() => scrollToSection('overview')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'overview'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Layout className="h-4 w-4" />
              <span>Overview</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('market')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'market'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <BarChart className="h-4 w-4" />
              <span>Market Analysis</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('financial')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'financial'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Calculator className="h-4 w-4" />
              <span>Financial Projections</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('roadmap')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'roadmap'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <GitBranch className="h-4 w-4" />
              <span>Implementation Steps</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('competitors')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'competitors'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Competitor Analysis</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('risks')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'risks'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Risk Assessment</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('research')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'research'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Microscope className="h-4 w-4" />
              <span>R&D</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('marketing')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'marketing'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <Megaphone className="h-4 w-4" />
              <span>Marketing</span>
            </span>
          </button>

          <button
            onClick={() => scrollToSection('trends')}
            className={`px-4 py-2 rounded-lg ${
              activeSection === 'trends'
                ? 'bg-indigo-600 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-100'
            }`}
          >
            <span className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Technology Trends</span>
            </span>
          </button>
        </div>
      </div>

      <div 
        ref={el => contentRef.current['overview'] = el}
        className="scroll-mt-32"
      >
        <PlanOverview 
          idea={plan.idea}
          overview={plan.overview}
          problemStatement={plan.problemStatement}
          targetMarket={plan.targetMarket}
          valueProposition={plan.valueProposition}
        />
      </div>

      {marketMetrics && (
        <div 
          ref={el => contentRef.current['market'] = el}
          className="scroll-mt-32"
        >
          <MarketAnalysis 
            idea={idea}
            metrics={marketMetrics}
          />
        </div>
      )}

      <div 
        ref={el => contentRef.current['financial'] = el}
        className="scroll-mt-32"
      >
        <FinancialProjections />
      </div>

      <div 
        ref={el => contentRef.current['roadmap'] = el}
        className="scroll-mt-32"
      >
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

      <div 
        ref={el => contentRef.current['competitors'] = el}
        className="scroll-mt-32"
      >
        <CompetitorAnalysis competitors={competitors} />
      </div>

      <div 
        ref={el => contentRef.current['risks'] = el}
        className="scroll-mt-32"
      >
        {riskAssessment && <RiskAssessment {...riskAssessment} />}
      </div>

      <div 
        ref={el => contentRef.current['research'] = el}
        className="scroll-mt-32"
      >
        {researchData && <ResearchAndDevelopment {...researchData} />}
      </div>

      <div 
        ref={el => contentRef.current['marketing'] = el}
        className="scroll-mt-32"
      >
        {marketingStrategy && <Marketing strategy={marketingStrategy} />}
      </div>

      <div 
        ref={el => contentRef.current['trends'] = el}
        className="scroll-mt-32"
      >
        {researchData && <TechnologyTrends trends={researchData.trends} />}
      </div>
    </div>
  );
}

export default RoadmapView;