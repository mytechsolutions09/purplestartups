import React from 'react';
import { Lightbulb, Loader } from 'lucide-react';

interface IdeaGeneratorProps {
  vagueConcept: string;
  setVagueConcept: (value: string) => void;
  onGenerate: (concept: string) => void;
  isLoading: boolean;
}

function IdeaGenerator({ vagueConcept, setVagueConcept, onGenerate, isLoading }: IdeaGeneratorProps) {
  return (
    <div className="text-center space-y-8 max-w-3xl mx-auto">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
          Transform Your Vague Idea Into a
          <span className="text-indigo-600"> Viable Startup</span>
        </h1>
        <p className="text-xl text-gray-600">
          Enter your concept and let AI generate actionable startup ideas with detailed roadmaps
        </p>
      </div>

      <div className="flex space-x-4">
        <input
          type="text"
          value={vagueConcept}
          onChange={(e) => setVagueConcept(e.target.value)}
          placeholder="Enter your concept (e.g., 'sustainable fashion')"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
        <button
          onClick={() => onGenerate(vagueConcept)}
          disabled={!vagueConcept.trim() || isLoading}
          className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isLoading ? (
            <Loader className="h-5 w-5 animate-spin" />
          ) : (
            <Lightbulb className="h-5 w-5" />
          )}
          <span>{isLoading ? 'Generating...' : 'Generate Ideas'}</span>
        </button>
      </div>
    </div>
  );
}

export default IdeaGenerator;