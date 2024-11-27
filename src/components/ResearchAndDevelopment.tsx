import React from 'react';
import { 
  Microscope, 
  Lightbulb, 
  Clock, 
  DollarSign, 
  Target, 
  AlertCircle,
  Gauge,
  Rocket
} from 'lucide-react';
import type { ResearchProject, TechnologyTrend } from '../types';

interface ResearchAndDevelopmentProps {
  projects: ResearchProject[];
  trends: TechnologyTrend[];
}

function ResearchAndDevelopment({ projects, trends }: ResearchAndDevelopmentProps) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semi-bold mb-4">Research Projects</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project) => (
            <div 
              key={project.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{project.title}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  project.priority === 'high' ? 'bg-red-100 text-red-800' :
                  project.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {project.priority}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{project.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Status:</span>
                  <span className="text-sm font-medium">{project.status}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Timeline:</span>
                  <span className="text-sm font-medium">{project.timeline}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Budget:</span>
                  <span className="text-sm font-medium">{project.budget}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4"></h2>
        <div className="grid gap-6 md:grid-cols-2">
          {trends.map((trend, index) => (
            <div 
              key={index}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-semibold">{trend.name}</h3>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  trend.maturityLevel === 'emerging' ? 'bg-blue-100 text-blue-800' :
                  trend.maturityLevel === 'growing' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-800'
                }`}>
                  {trend.maturityLevel}
                </span>
              </div>
              <p className="text-gray-600 mb-4">{trend.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Relevance Score:</span>
                  <span className="text-sm font-medium">{trend.relevanceScore}/10</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Implementation:</span>
                  <span className="text-sm font-medium">{trend.implementationComplexity}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Est. Cost:</span>
                  <span className="text-sm font-medium">{trend.estimatedCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ResearchAndDevelopment; 