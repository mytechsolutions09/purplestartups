import React from 'react';
import { CheckCircle, Clock, BookOpen, Target, DollarSign } from 'lucide-react';
import type { StartupStep } from '../../types';

interface StepCardProps {
  step: StartupStep;
  stepNumber: number;
}

function StepCard({ step, stepNumber }: StepCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-indigo-100 transition-all duration-300">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-10 h-10 bg-indigo-50 rounded-xl">
              <span className="text-indigo-600 font-semibold">{stepNumber}</span>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
              <p className="text-sm text-gray-500 mt-1 flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {step.estimatedTimeframe}
              </p>
            </div>
          </div>
        </div>

        <p className="text-gray-600 mb-6">{step.description}</p>

        {/* Critical Factors */}
        <div className="mb-8">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Critical Success Factors</h4>
          <div className="flex flex-wrap gap-2">
            {step.criticalFactors.map((factor, index) => (
              <span
                key={index}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-white text-indigo-600 rounded-lg text-sm border border-indigo-100"
              >
                {factor}
              </span>
            ))}
          </div>
        </div>

        {/* Tasks */}
        <div className="space-y-4">
          {step.tasks.map((task, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <CheckCircle className="h-5 w-5 text-indigo-600" />
                <h4 className="font-medium text-gray-900">{task.title}</h4>
              </div>
              <p className="text-gray-600 ml-8 mb-4">{task.description}</p>
              
              <div className="ml-8 flex flex-wrap gap-4">
                <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                  <Clock className="h-4 w-4 text-indigo-500" />
                  <span>{task.timeline}</span>
                </div>
                
                {task.resources && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                    <BookOpen className="h-4 w-4 text-indigo-500" />
                    <span>{task.resources.join(', ')}</span>
                  </div>
                )}
                
                {task.metrics && (
                  <div className="flex items-center space-x-2 text-sm text-gray-500 bg-white px-3 py-1.5 rounded-lg border border-gray-100">
                    <Target className="h-4 w-4 text-indigo-500" />
                    <span>Metrics: {task.metrics.join(', ')}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default StepCard;