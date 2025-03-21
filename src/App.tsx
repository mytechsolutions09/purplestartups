import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import IdeaGenerator from './components/IdeaGenerator';
import IdeaList from './components/IdeaList';
import RoadmapView from './components/RoadmapView';
import { generateIdeasWithAI } from './utils/api';
import { SavedPlansProvider } from './contexts/SavedPlansContext';
import Navbar from './components/Navbar';
import { StartupPlan } from './types';
import FollowStepsPage from './pages/FollowStepsPage';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import RoadmapPage from './pages/RoadmapPage';
import ProductRoadmapPage from './pages/ProductRoadmapPage';
import TechnologyPage from './pages/TechnologyPage';
import RecruitmentPage from './pages/RecruitmentPage';
import MarketingPage from './pages/MarketingPage';
import StorePage from './pages/StorePage';
import { StorePageProvider } from './contexts/StorePageContext';
import Footer from './components/Footer';
import AppsPage from './pages/AppsPage';
import FeaturesPage from './pages/FeaturesPage';
import HelpPage from './pages/HelpPage';
import FAQPage from './pages/FAQPage';
import ContactPage from './pages/ContactPage';
import AboutPage from './pages/AboutPage';
import CareersPage from './pages/CareersPage';
import BlogPage from './pages/BlogPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import CookiesPage from './pages/CookiesPage';
import PricingPage from './pages/PricingPage';
import { AuthProvider } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import SavedIdeasPage from './pages/SavedIdeasPage';
import SecurityPage from './pages/SecurityPage';
import AccountSettingsPage from './pages/AccountSettingsPage';
import DashboardPage from './pages/DashboardPage';
import NotificationsPage from './pages/NotificationsPage';
import BillingPage from './pages/BillingPage';
import DashboardWelcome from './components/DashboardWelcome';
import ApiSettingsPage from './pages/ApiSettingsPage';
import ProfilePicturePage from './pages/ProfilePicturePage';
import { SubscriptionProvider } from './contexts/SubscriptionContext';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [vagueConcept, setVagueConcept] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StartupPlan | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);

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
    <AuthProvider>
      <SubscriptionProvider>
        <StorePageProvider>
          <SavedPlansProvider>
            <BrowserRouter>
              <ScrollToTop />
              <div className="flex min-h-screen flex-col">
                <Navbar onSelectPlan={handleSelectSavedPlan} />
                
                <div className="flex flex-1">
                  {/* Sidebar if you have one */}
                  {showSidebar && (
                    <div className="w-64 bg-white shadow-sm">
                      {/* Sidebar content */}
                    </div>
                  )}
                  
                  {/* Main content */}
                  <div className="flex-1">
                    <Routes>
                      {/* Public routes */}
                      <Route path="/login" element={<LoginPage />} />
                      <Route path="/signup" element={<SignupPage />} />
                      <Route path="/" element={
                        <div className="min-h-screen flex flex-col">
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
                        </div>
                      } />
                      
                      {/* Protected routes */}
                      <Route path="/roadmap" element={
                        <ProtectedRoute>
                          <RoadmapPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/product-roadmap" element={
                        <ProtectedRoute>
                          <ProductRoadmapPage />
                        </ProtectedRoute>
                      } />
                      
                      {/* Add more protected routes as needed */}
                      
                      {/* Public content pages */}
                      <Route path="/features" element={<FeaturesPage />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/about" element={<AboutPage />} />
                      <Route path="/privacy" element={<PrivacyPage />} />
                      <Route path="/terms" element={<TermsPage />} />
                      <Route path="/cookies" element={<CookiesPage />} />
                      
                      {/* Dashboard with nested routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }>
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="security" element={<SecurityPage />} />
                        <Route path="saved-ideas" element={<SavedIdeasPage />} />
                        <Route path="notifications" element={<NotificationsPage />} />
                        <Route path="billing" element={<BillingPage />} />
                        <Route path="api" element={<ApiSettingsPage />} />
                        <Route path="avatar" element={<ProfilePicturePage />} />
                        <Route path="help" element={<HelpPage />} />
                        <Route index element={<DashboardWelcome />} />
                      </Route>

                      {/* Add this new route to handle roadmap with ID parameter */}
                      <Route path="/roadmap/:id" element={<RoadmapPage />} />
                    </Routes>
                  </div>
                </div>
                
                <Footer />
              </div>
            </BrowserRouter>
          </SavedPlansProvider>
        </StorePageProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;