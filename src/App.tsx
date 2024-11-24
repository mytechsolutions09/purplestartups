import React, { useState } from 'react';
import { Rocket } from 'lucide-react';
import IdeaGenerator from './components/IdeaGenerator';
import IdeaList from './components/IdeaList';
import RoadmapView from './components/RoadmapView';
import { generateIdeasWithAI } from './utils/api';
import { SavedPlansProvider } from './contexts/SavedPlansContext';
import Navbar from './components/Navbar';
import { StartupPlan } from './types';

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
    <SavedPlansProvider>
      <div className="min-h-screen bg-gray-50">
        <Navbar onSelectPlan={handleSelectSavedPlan} />
        <main className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
      </div>
    </SavedPlansProvider>
  );
}

export default App;