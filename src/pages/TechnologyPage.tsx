import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, GitBranch, TrendingUp, AlertTriangle, X, Loader, Battery, Recycle, TestTube, ChevronRight } from 'lucide-react';
import { getTechnologyStack, getTechnologyRoadmap, getTechnologyTrends, getTechnicalDebt } from '../utils/api';

function TechnologyPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const idea = searchParams.get('idea');

  const [activeTab, setActiveTab] = useState('stack');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [techStack, setTechStack] = useState<TechnologyStack[]>([]);
  const [roadmap, setRoadmap] = useState<TechnologyRoadmapItem[]>([]);
  const [trends, setTrends] = useState<TechnologyTrend[]>([]);
  const [debtMetrics, setDebtMetrics] = useState<TechnicalDebtMetric[]>([]);

  useEffect(() => {
    const loadTechnologyData = async () => {
      if (!idea) return;
      
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all data in parallel
        const [stackData, roadmapData, trendsData, debtData] = await Promise.all([
          getTechnologyStack(idea),
          getTechnologyRoadmap(idea),
          getTechnologyTrends(idea),
          getTechnicalDebt(idea)
        ]);

        setTechStack(stackData);
        setRoadmap(roadmapData);
        setTrends(trendsData);
        setDebtMetrics(debtData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load technology data');
      } finally {
        setIsLoading(false);
      }
    };

    loadTechnologyData();
  }, [idea]);

  return (
    <div className="space-y-8">
      {/* New Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <div className="max-w-3xl">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Technology Assessment
            </h1>
            <p className="text-xl text-blue-100 mb-6">
              {idea || 'Analyzing your startup technology requirements'}
            </p>
            {isLoading ? (
              <div className="flex items-center space-x-3 text-blue-100">
                <Loader className="h-5 w-5 animate-spin" />
                <span>Analyzing technology requirements...</span>
              </div>
            ) : error ? (
              <div className="text-red-200">
                {error}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Move existing content into a container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Tabs - remove the button to go back since it's in the hero now */}
        <div className="flex space-x-4 border-b">
          {[
            { id: 'stack', label: 'Tech Stack', icon: Wrench },
            { id: 'roadmap', label: 'Implementation', icon: GitBranch },
            { id: 'trends', label: 'Tech Trends', icon: TrendingUp },
            { id: 'debt', label: 'Technical Debt', icon: AlertTriangle }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 border-b-2 transition-colors ${
                activeTab === tab.id 
                  ? 'border-indigo-600 text-indigo-600' 
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              <tab.icon className="h-5 w-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Tech Stack Section */}
        {activeTab === 'stack' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Battery className="h-5 w-5 text-indigo-600" />
                Core Technologies
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Advanced Material Science</h3>
                    <p className="text-gray-600">Biodegradable electrode materials and eco-friendly electrolytes</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Green Chemistry</h3>
                    <p className="text-gray-600">Sustainable synthesis processes and recycling technologies</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-indigo-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Battery Management Systems</h3>
                    <p className="text-gray-600">Smart monitoring and lifecycle optimization</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Recycle className="h-5 w-5 text-green-600" />
                Sustainability Features
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Recycling Infrastructure</h3>
                    <p className="text-gray-600">End-of-life processing and material recovery systems</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Environmental Monitoring</h3>
                    <p className="text-gray-600">Impact assessment and lifecycle analysis tools</p>
                  </div>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <TestTube className="h-5 w-5 text-blue-600" />
                Research & Testing
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Material Characterization</h3>
                    <p className="text-gray-600">Advanced analytical and testing equipment</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <ChevronRight className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-medium">Performance Validation</h3>
                    <p className="text-gray-600">Battery testing and certification facilities</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Add other tab content sections here */}
      </div>
    </div>
  );
}

export default TechnologyPage; 