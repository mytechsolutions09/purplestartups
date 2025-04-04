import React, { useState, useEffect } from 'react';
import { Rocket } from 'lucide-react';
import IdeaGenerator from './components/IdeaGenerator';
import IdeaList from './components/IdeaList';
import RoadmapView from './components/RoadmapView';
import { generateIdeasWithAI } from './utils/api';
import { SavedPlansProvider, useSavedPlans } from './contexts/SavedPlansContext';
import Navbar from './components/Navbar';
import { StartupPlan } from './types/StartupPlan';
import FollowStepsPage from './pages/FollowStepsPage';
import { BrowserRouter, Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
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
import { AuthProvider, useAuth } from './contexts/AuthContext';
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
import { SubscriptionProvider, useSubscription } from './contexts/SubscriptionContext';
import AdminRoutes from './routes/AdminRoutes';
import AdminRoute from './components/AdminRoute';
import { supabase } from './utils/supabaseClient';
import { setupRoleSchema } from './utils/roleSchema';
import AdminSetupPage from './pages/AdminSetupPage';
import AdminDebugPage from './pages/AdminDebugPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminLayout from './components/AdminLayout';
import UserManagementPage from './pages/admin/UserManagementPage';
import ContentManagementPage from './pages/admin/ContentManagementPage';
import SettingsPage from './pages/admin/SettingsPage';
import AdminEntryPage from './pages/AdminEntryPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import UpgradeModal from './components/UpgradeModal';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// Create a new component for the app content
function AppContent() {
  const [vagueConcept, setVagueConcept] = useState('');
  const [ideas, setIdeas] = useState<string[]>([]);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<StartupPlan | null>(null);
  const [showSidebar, setShowSidebar] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  
  // Now this hook is used within a Router context
  const { loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { savedPlans } = useSavedPlans();
  const { canGeneratePlan, subscription, incrementPlansGenerated } = useSubscription();

  // Keep all your functions and useEffect hooks here
  const handleGenerateIdeas = async (concept: string) => {
    setIsLoading(true);
    
    // Check subscription limit first
    if (!canGeneratePlan) {
      // Show upgrade modal
      setUpgradeModalOpen(true);
      setIsLoading(false);
      return;
    }
    
    try {
      const generatedIdeas = await generateIdeasWithAI(concept);
      setIdeas(generatedIdeas);
      
      // Increment the counter only after successful generation
      await incrementPlansGenerated();
    } catch (error) {
      console.error('Failed to generate ideas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlanSelect = (plan: StartupPlan) => {
    setCurrentPlan(plan);
    
    // Update the URL to include the plan ID
    // This could be the plan id or a timestamp or some unique identifier
    if (plan.id) {
      navigate(`/plan/${plan.id}`, { replace: false });
    } else if (plan.timestamp) {
      navigate(`/plan/${plan.timestamp}`, { replace: false });
    }
    
    setShowSidebar(false);
  };

  useEffect(() => {
    // Set up the database schema for roles and settings (only runs once)
    setupRoleSchema().then(({ success, error }) => {
      if (success) {
        console.log('Role schema setup complete');
      } else {
        console.error('Error setting up role schema:', error);
      }
    });

    // Get initial session
    const getInitialSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error getting session:', error);
      } else {
        setSession(data.session);
      }
    };
    
    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    // Extract plan ID from URL if present
    const pathname = window.location.pathname;
    const match = pathname.match(/\/plan\/(\w+)/);
    
    if (match && match[1]) {
      const planId = match[1];
      
      // Find plan in saved plans or load it from API/database
      if (savedPlans) {
        const foundPlan = savedPlans.find(p => 
          p.id === planId || p.timestamp?.toString() === planId
        );
        
        if (foundPlan) {
          setCurrentPlan(foundPlan);
        } else {
          // If not found in saved plans, try to fetch it from the server
          // This would depend on your API structure
          // fetchPlanById(planId).then(plan => setCurrentPlan(plan));
        }
      }
    }
  }, []);

  // Don't render routes until auth is loaded
  if (authLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <div className="spinner h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-lg">Loading authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onSelectPlan={handlePlanSelect} />
      
      <div className="flex flex-1">
        {/* Sidebar if you have one */}
        {showSidebar && (
          <div className="w-64 bg-white shadow-sm">
            {/* Sidebar content */}
          </div>
        )}
        
        {/* Main content with all your routes */}
        <div className="flex-1">
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={
              <LoginPage 
                onLoginSuccess={() => {
                  // Check if we have a saved idea to select after login
                  const savedState = window.history.state;
                  if (savedState && savedState.ideaToSelect) {
                    handlePlanSelect(savedState.ideaToSelect as StartupPlan);
                  }
                }} 
              />
            } />
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
            
            {/* Add the missing Help route */}
            <Route path="/help" element={<HelpPage />} />
            
            {/* Add the missing FAQ route */}
            <Route path="/faq" element={<FAQPage />} />
            
            {/* Add the missing Contact route */}
            <Route path="/contact" element={<ContactPage />} />
            
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
            
            {/* Admin routes with single layout */}
            <Route path="/admin" element={<AdminEntryPage />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route path="dashboard" element={<AdminDashboardPage />} />
              <Route path="users" element={<UserManagementPage />} />
              <Route path="content" element={<ContentManagementPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="analytics" element={<AnalyticsPage />} />
            </Route>
            
            {/* Public content pages */}
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            
            {/* Dashboard with nested routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <div>
                  <DashboardPage />
                </div>
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

            {/* Add this route */}
            <Route path="/admin-debug" element={
              <ProtectedRoute>
                <AdminDebugPage />
              </ProtectedRoute>
            } />

            {/* Add this new route */}
            <Route path="/plan/:planId" element={
              <main className="flex-grow">
                <Navbar onSelectPlan={handlePlanSelect} />
                <div className="pt-16">
                  <RoadmapView plan={currentPlan} onCloseSidebar={() => setShowSidebar(false)} />
                </div>
              </main>
            } />
          </Routes>
        </div>
      </div>
      
      <Footer />

      {/* Upgrade Modal */}
      <UpgradeModal 
        isOpen={upgradeModalOpen}
        onClose={() => setUpgradeModalOpen(false)}
        currentPlan={subscription.plan === 'pro' ? 'pro' : 
                    subscription.plan === 'enterprise' ? 'enterprise' : 'free'}
      />
    </div>
  );
}

// The main App component that provides context providers
function App() {
  return (
    <AuthProvider>
      <SubscriptionProvider>
        <StorePageProvider>
          <SavedPlansProvider>
            <BrowserRouter>
              <AppContent />
            </BrowserRouter>
          </SavedPlansProvider>
        </StorePageProvider>
      </SubscriptionProvider>
    </AuthProvider>
  );
}

export default App;