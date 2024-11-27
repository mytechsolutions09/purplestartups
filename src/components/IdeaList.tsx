import React from 'react';
import { ArrowRight, Lightbulb, TrendingUp, Users, Target } from 'lucide-react';

interface IdeaListProps {
  ideas: string[];
  onSelectIdea: (idea: string) => void;
}

function IdeaList({ ideas, onSelectIdea }: IdeaListProps) {
  // Helper function to get a random accent color class
  const getAccentColor = (index: number) => {
    const colors = [
      'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
      
      
    ];
    return colors[index % colors.length];
  };

  // Helper function to get a random icon
  const getIcon = (index: number) => {
    const icons = [
      <Lightbulb className="w-5 h-5" />,
      <TrendingUp className="w-5 h-5" />,
      <Users className="w-5 h-5" />,
      <Target className="w-5 h-5" />,
    ];
    return icons[index % icons.length];
  };

  return (
    <div className="max-w-5xl mx-auto">
        <h2 className=" text-xl font-bold mb-6 text-gray-900 ">List of Ideas</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ideas.map((idea, index) => (
          <button
            key={index}
            onClick={() => onSelectIdea(idea)}
            className={`group relative p-6 rounded-xl border-2 transition-all duration-200 
              ${getAccentColor(index)}
              transform hover:scale-102 hover:shadow-md`}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                {getIcon(index)}
              </div>
              
              <div className="flex-1 text-left">
                <h3 className="font-semibold text-gray-900 mb-2 pr-6">
                  {idea}
                </h3>
                
                <div className="flex items-center text-sm text-gray-600">
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center">
                    View Details 
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </span>
                </div>
              </div>
            </div>

            {/* Decorative corner accent */}
            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
              <div className={`absolute transform rotate-45 translate-x-8 -translate-y-8 w-16 h-3 
                ${index % 2 === 0 ? 'bg-indigo-100' : 'bg-emerald-100'}`} 
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

export default IdeaList;