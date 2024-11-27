import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function FollowSteps() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    if (location.state?.returnPath) {
      navigate(location.state.returnPath);
    } else {
      navigate(-1);
    }
  };

  return (
    <button onClick={handleBack}>
      <ArrowLeft className="h-5 w-5" />
      <span>Back to roadmap</span>
    </button>
  );
} 