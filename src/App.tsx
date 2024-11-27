import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import IdeaGenerator from './components/IdeaGenerator';
import IdeaList from './components/IdeaList';
import RoadmapView from './components/RoadmapView';
import { generateIdeasWithAI } from './utils/api';
import { SavedPlansProvider } from './contexts/SavedPlansContext';
import Navbar from './components/Navbar';
import { StartupPlan } from './types';
import FollowStepsPage from './pages/FollowStepsPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RoadmapPage from './pages/RoadmapPage';
import TechnologyPage from './pages/TechnologyPage';
import RecruitmentPage from './pages/RecruitmentPage';
import MarketingPage from './pages/MarketingPage';
import StorePage from './pages/StorePage';
import { StorePageProvider } from './contexts/StorePageContext';
import Footer from './components/Footer';
import AppsPage from './pages/AppsPage';

function App() {
  const [vagueConcept, setVagueConcept] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StartupPlan | null>(null);

  const handleGenerateIdeas = async (concept: string) => {
    setIsLoading(true);
    try {
      const generatedIdeas = await generateIdeasWithAI(concept);
      setIdeas(generatedIdeas);
    } catch (error) {
      console.error('Failed to generate ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectSavedPlan = (plan: StartupPlan) => {
    setCurrentPlan(plan);
    setSelectedIdea(plan.idea);
  };

  return (
    <StorePageProvider>
      <SavedPlansProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={
              <div className="min-h-screen flex flex-col">
                <Navbar onSelectPlan={handleSelectSavedPlan} />
                <main className="flex-1 pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                  {selectedIdea ? (
                    <RoadmapView 
                      idea={selectedIdea} 
                      onBack={() => {
                        setSelectedIdea(null);
                        setCurrentPlan(null);
                      }} 
                    />
                  ) : (
                    <>
                      <IdeaGenerator
                        vagueConcept={vagueConcept}
                        setVagueConcept={setVagueConcept}
                        onGenerate={handleGenerateIdeas}
                        isLoading={isLoading}
                      />
                      {ideas.length > 0 && (
                        <IdeaList
                          ideas={ideas}
                          onSelectIdea={setSelectedIdea}
                        />
                      )}
                    </>
                  )}
                </main>
                <Footer />
              </div>
            } />
            <Route path="/roadmap" element={<RoadmapPage />} />
            <Route path="/follow-steps" element={<FollowStepsPage />} />
            <Route path="/technology" element={<TechnologyPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/marketing" element={<MarketingPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/apps" element={<AppsPage />} />
          </Routes>
        </BrowserRouter>
      </SavedPlansProvider>
    </StorePageProvider>
  );
}

export default App;