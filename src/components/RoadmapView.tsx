import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Loader, Save, Layout, BarChart, Calculator, GitBranch, Shield, AlertTriangle, TrendingDown, Building, Tool, Microscope, TrendingUp, Megaphone, Code, FileText, Share2, Presentation } from 'lucide-react';
import StepCard from './roadmap/StepCard';
import PlanOverview from './roadmap/PlanOverview';
import { generateStartupPlanWithAI } from '../utils/api';
import type { StartupPlan } from '../types';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import MarketAnalysis from './MarketAnalysis';
import { getMarketAnalysis } from '../utils/api';
import FinancialProjections from './FinancialProjections';
import CompetitorAnalysis from './CompetitorAnalysis';
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
import { generateWebsitePrompt } from '../utils/api';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import PptxGenJS from "pptxgenjs";

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
  const [websitePrompt, setWebsitePrompt] = useState<string | null>(null);
  const [isPromptLoading, setIsPromptLoading] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // First generate the plan since other calls might depend on it
        const generatedPlan = await generateStartupPlanWithAI(idea);
        
        // Then load all other data in parallel
        const [
          analysis, 
          competitorData, 
          risks, 
          rdData, 
          marketing
        ] = await Promise.all([
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

        // Generate website prompt separately to avoid blocking other data
        setIsPromptLoading(true);
        try {
          console.log('Generating website prompt for idea:', idea);
          const prompt = await generateWebsitePrompt(idea);
          console.log('Successfully generated prompt:', prompt);
          setWebsitePrompt(prompt);
        } catch (promptErr) {
          console.error('Website prompt generation failed:', promptErr);
          // Don't let prompt errors affect the rest of the app
        } finally {
          setIsPromptLoading(false);
        }

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
        console.error('Error loading data:', err);
        setError(err instanceof Error ? err.message : 'Failed to generate plan');
      } finally {
        setIsLoading(false);
      }
    };

    if (idea) {
      loadData();
    }

    return () => {
      setIsLoading(false);
      setError(null);
      hasSavedRef.current = false;
    };
  }, [idea, savedPlans, savePlan]);

  // Smooth scroll handler for navigation
  const scrollToSection = (sectionId: string) => {
    if (sectionId === 'store') {
      navigate('/store'); // Navigate to store route
      return;
    }
    
    contentRef.current[sectionId]?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
    setActiveSection(sectionId);
  };

  const copyPromptToClipboard = async () => {
    if (websitePrompt) {
      try {
        await navigator.clipboard.writeText(websitePrompt);
        // You might want to add a toast notification here
      } catch (err) {
        console.error('Failed to copy prompt:', err);
      }
    }
  };

  const handleExport = async (type: string) => {
    if (!plan) return;

    switch (type) {
      case 'pdf':
        await exportToPDF();
        break;
      case 'presentation':
        await exportToPresentation();
        break;
      case 'share':
        await shareLink();
        break;
    }
  };

  const exportToPDF = async () => {
    try {
      const content = document.querySelector('.space-y-8');
      if (!content) return;

      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // A4 dimensions in pixels (assuming 96 DPI)
      const a4Width = 210; // mm
      const a4Height = 297; // mm

      const canvas = await html2canvas(content as HTMLElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        logging: false,
        windowWidth: content.scrollWidth
      });

      // Calculate scaling to fit A4 width while maintaining aspect ratio
      const imgWidth = a4Width;
      const imgHeight = (canvas.height * a4Width) / canvas.width;
      
      // Add image to PDF, splitting across multiple pages if needed
      let heightLeft = imgHeight;
      let position = 0;
      let pageNumber = 1;

      while (heightLeft >= 0) {
        // Add new page if not first page
        if (position !== 0) {
          pdf.addPage();
        }

        pdf.addImage(
          canvas.toDataURL('image/jpeg', 1.0),
          'JPEG',
          0,
          position,
          imgWidth,
          imgHeight,
          '',
          'FAST'
        );

        heightLeft -= a4Height;
        position -= a4Height;
        pageNumber++;
      }

      pdf.save(`${plan.idea}-startup-plan.pdf`);
    } catch (err) {
      console.error('Failed to export PDF:', err);
    }
  };

  const exportToPresentation = async () => {
    try {
      const pptx = new PptxGenJS();

      // Title slide
      const slide1 = pptx.addSlide();
      slide1.addText(plan.idea, {
        x: 1,
        y: 1,
        w: '80%',
        fontSize: 24,
        bold: true
      });

      // Overview slide
      const slide2 = pptx.addSlide();
      slide2.addText('Overview', {
        x: 1,
        y: 0.5,
        fontSize: 18,
        bold: true
      });
      slide2.addText(plan.overview, {
        x: 1,
        y: 1.5,
        w: '80%',
        fontSize: 14
      });

      // Market Analysis slide
      if (marketMetrics) {
        const slide3 = pptx.addSlide();
        slide3.addText('Market Analysis', {
          x: 1,
          y: 0.5,
          fontSize: 18,
          bold: true
        });
        // Add market metrics data...
      }

      // Add more slides for other sections...

      pptx.writeFile(`${plan.idea}-presentation.pptx`);
    } catch (err) {
      console.error('Failed to create presentation:', err);
    }
  };

  const shareLink = async () => {
    try {
      // Generate a unique sharing URL
      const shareableUrl = `${window.location.origin}/shared/${plan.id}`;
      
      // Copy to clipboard
      await navigator.clipboard.writeText(shareableUrl);
      
      // Show success message (you might want to add a toast notification system)
      alert('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to share link:', err);
    }
  };

  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Sidebar Navigation - Fixed position */}
      <div className="fixed left-0 top-0 h-screen w-48 bg-gray-50 p-3 pt-12 border-r border-gray-200 overflow-y-auto">
        <button
          onClick={onBack}
          className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 transition-colors mb-4 w-full text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>

        <div className="flex flex-col space-y-1">
          {[
            { id: 'overview', icon: Layout, label: 'Overview' },
            { id: 'market', icon: BarChart, label: 'Market' },
            { id: 'competitors', icon: Shield, label: 'Competitors' },
            { id: 'risks', icon: AlertTriangle, label: 'Risks' },
            { id: 'research', icon: Microscope, label: 'R&D' },
            { id: 'marketing', icon: Megaphone, label: 'Marketing' },
            { id: 'trends', icon: TrendingUp, label: 'Trends' },
            { id: 'website', icon: Code, label: 'Website' },
            { id: 'store', icon: Building, label: 'Store', external: true },
          ].map(({ id, icon: Icon, label, external }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg w-full text-left text-sm ${
                activeSection === id && !external
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content - Add margin to prevent overlap with sidebar */}
      <div className="flex-1 ml-48 p-8 pb-16 overflow-y-auto">
        {/* Export Options Header */}
        {!isLoading && plan && (
          <div className="mb-8 flex justify-end">
            <div className="flex items-center gap-2">
              {[
                { id: 'pdf', icon: FileText, ariaLabel: 'Export as PDF' },
                { id: 'presentation', icon: Presentation, ariaLabel: 'Create Presentation' },
                { id: 'share', icon: Share2, ariaLabel: 'Share Link' }
              ].map(({ id, icon: Icon, ariaLabel }) => (
                <button
                  key={id}
                  onClick={() => handleExport(id)}
                  aria-label={ariaLabel}
                  title={ariaLabel}
                  className="p-1 text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="flex flex-col items-center space-y-4">
              <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
              <p className="text-gray-600">Generating your startup plan...</p>
            </div>
          </div>
        ) : error ? (
          <div className="p-8 bg-red-50 rounded-lg text-red-700">
            <p>{error}</p>
            <button
              onClick={onBack}
              className="mt-4 text-red-600 hover:text-red-800 font-medium"
            >
              Go back and try again
            </button>
          </div>
        ) : !plan ? null : (
          // Content Sections
          <div className="space-y-8">
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

            <div 
              ref={el => contentRef.current['website'] = el}
              className="scroll-mt-32"
            >
              {isPromptLoading ? (
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-center">
                    <Loader className="h-8 w-8 text-indigo-600 animate-spin" />
                    <span className="ml-2">Generating website prompt...</span>
                  </div>
                </div>
              ) : websitePrompt && (
                <div className="p-6 bg-white rounded-lg shadow-md">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">AI Website Generation Prompt</h2>
                    <button
                      onClick={copyPromptToClipboard}
                      className="flex items-center space-x-2 px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <span>Copy Prompt</span>
                    </button>
                  </div>
                  <div className="prose max-w-none">
                    <p className="text-gray-600 mb-4">
                      Use this prompt with AI tools like Claude or ChatGPT to generate a website for your startup:
                    </p>
                    <pre className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                      {websitePrompt}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default RoadmapView;