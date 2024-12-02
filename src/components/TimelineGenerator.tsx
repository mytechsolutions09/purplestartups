import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface Milestone {
  title: string;
  description: string;
  deadline: string;
  status: 'pending' | 'completed' | 'at-risk';
  dependencies: string[];
}

interface TimelineProps {
  milestones: Milestone[];
}

function TimelineGenerator({ milestones }: TimelineProps) {
  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'at-risk': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
        <Calendar className="h-6 w-6 text-indigo-600" />
        Project Timeline
      </h2>

      <div className="relative">
        <div className="flex justify-between items-center">
          <div className="flex-1">
            <div className="text-gray-800 font-medium">Launch & Awareness</div>
            <div className="text-gray-500 text-sm">3 months</div>
          </div>
          <div className="flex-1 text-center">
            <div className="text-gray-800 font-medium">Lead Generation & Conversion</div>
            <div className="text-gray-500 text-sm">6 months</div>
          </div>
          <div className="flex-1 text-right">
            <div className="text-gray-800 font-medium">Expansion & Retention</div>
            <div className="text-gray-500 text-sm">Ongoing</div>
          </div>
        </div>
        <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gray-300 -translate-y-1/2" />

        {milestones.map((milestone, index) => (
          <div key={index} className="mb-8 relative pl-8">
            <div className="absolute left-0 top-0 h-full w-px bg-gray-200" />
            <div className={`absolute left-[-4px] top-1 h-2 w-2 rounded-full ${
              milestone.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
            }`} />
            
            <div className="bg-white rounded-lg border border-gray-100 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{milestone.title}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(milestone.status)}`}>
                  {milestone.status}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
              
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-gray-500">
                  <Clock className="h-4 w-4" />
                  {milestone.deadline}
                </span>
                
                {milestone.dependencies.length > 0 && (
                  <span className="flex items-center gap-1 text-gray-500">
                    <AlertCircle className="h-4 w-4" />
                    Dependencies: {milestone.dependencies.join(', ')}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimelineGenerator; 