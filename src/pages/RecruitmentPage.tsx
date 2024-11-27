import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, Building, Briefcase, Target, ChartBar } from 'lucide-react';

function RecruitmentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const idea = searchParams.get('idea');

  const handleBack = () => {
    navigate(`/follow-steps?idea=${encodeURIComponent(idea || '')}`);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={handleBack}
            className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>
          
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">
              Build Your Dream Team
            </h1>
            <p className="text-lg sm:text-xl mb-6 text-indigo-100">
              Strategic recruitment planning and team structure for your startup's success
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Recruitment Overview */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Users className="h-5 w-5 text-indigo-600" />
            Recruitment Planning
          </h2>
          {/* Add your recruitment content here */}
        </div>

        {/* Team Structure */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Building className="h-5 w-5 text-indigo-600" />
            Team Structure
          </h2>
          {/* Add team structure content */}
        </div>

        {/* Job Descriptions */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-indigo-600" />
            Job Descriptions
          </h2>
          {/* Add job descriptions content */}
        </div>
      </div>
    </div>
  );
}

export default RecruitmentPage; 