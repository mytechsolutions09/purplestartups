import React from 'react';
import { Layout, BarChart, Calculator, GitBranch, Shield, AlertTriangle, Microscope, Megaphone, TrendingUp, Code } from 'lucide-react';

interface PageNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

function PageNavigation({ activeSection, onSectionChange }: PageNavigationProps) {
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Layout },
    { id: 'market', label: 'Market Analysis', icon: BarChart },
    { id: 'financial', label: 'Financial', icon: Calculator },
    { id: 'implementation', label: 'Implementation', icon: GitBranch },
    { id: 'competitors', label: 'Competitors', icon: Shield },
    { id: 'risks', label: 'Risks', icon: AlertTriangle },
    { id: 'research', label: 'R&D', icon: Microscope },
    { id: 'marketing', label: 'Marketing', icon: Megaphone },
    { id: 'trends', label: 'Trends', icon: TrendingUp },
    { id: 'website', label: 'Website', icon: Code },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
      {navigationItems.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onSectionChange(id)}
          className={`px-4 py-2 rounded-lg transition-colors ${
            activeSection === id
              ? 'bg-indigo-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-100'
          }`}
        >
          <span className="flex items-center space-x-2">
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

export default PageNavigation; 