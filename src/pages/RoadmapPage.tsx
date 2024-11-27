import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import RoadmapView from '../components/RoadmapView';

function RoadmapPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idea = searchParams.get('idea');

  if (!idea) {
    return null;
  }

  const handleBack = () => {
    navigate('/');
  };

  return <RoadmapView idea={idea} onBack={handleBack} />;
}

export default RoadmapPage; 