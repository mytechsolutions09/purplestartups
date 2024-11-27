import React from 'react';
import { AlertTriangle, TrendingDown, Building, Wrench } from 'lucide-react';

interface Risk {
  risk: string;
  impact: 'High' | 'Medium' | 'Low';
  mitigation: string;
}

interface RiskAssessmentProps {
  marketRisks: Risk[];
  financialRisks: Risk[];
  operationalRisks: Risk[];
  overallRiskScore: number;
}

function RiskAssessment({ marketRisks, financialRisks, operationalRisks, overallRiskScore }: RiskAssessmentProps) {
  const getImpactColor = (impact: Risk['impact']) => {
    switch (impact) {
      case 'High': return 'text-red-600 ';
      case 'Medium': return 'text-yellow-600 ';
      case 'Low': return 'text-green-600 ';
    }
  };

  const RiskSection = ({ title, risks, icon: Icon }: { title: string; risks: Risk[]; icon: any }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-indigo-600" />
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <div className="space-y-3">
        {risks.map((risk, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-100 p-4">
            <div className="flex justify-between items-start mb-2">
              <span className="font-medium text-gray-800">{risk.risk}</span>
              <span className={`px-2 py-1 rounded-full text-sm font-medium ${getImpactColor(risk.impact)}`}>
                {risk.impact} Impact
              </span>
            </div>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Mitigation: </span>
              {risk.mitigation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <AlertTriangle className="h-6 w-6 text-indigo-600" />
          Risk Assessment
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Overall Risk Score:</span>
          <span className={`px-3 py-1 rounded-full font-medium text-sm
            ${overallRiskScore <= 3 ? 'bg-green-50 text-green-600' :
              overallRiskScore <= 7 ? 'bg-yellow-50 text-yellow-600' :
                'bg-red-50 text-red-600'}`}>
            {overallRiskScore}/10
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <RiskSection title="Market Risks" risks={marketRisks} icon={TrendingDown} />
        <RiskSection title="Financial Risks" risks={financialRisks} icon={Building} />
        <RiskSection title="Operational Risks" risks={operationalRisks} icon={Wrench} />
      </div>
    </div>
  );
}

export default RiskAssessment; 