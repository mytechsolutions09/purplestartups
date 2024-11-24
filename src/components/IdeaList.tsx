import React from 'react';
import { ChevronRight } from 'lucide-react';

interface IdeaListProps {
  ideas: string[];
  onSelectIdea: (idea: string) => void;
}

function IdeaList({ ideas, onSelectIdea }: IdeaListProps) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">Generated Startup Ideas</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-2">
        {ideas.map((idea, index) => (
          <div
            key={index}
            onClick={() => onSelectIdea(idea)}
            className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                  Idea #{index + 1}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
                  {idea}
                </h3>
              </div>
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default IdeaList;