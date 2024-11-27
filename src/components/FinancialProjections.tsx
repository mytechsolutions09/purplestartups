import React, { useState } from 'react';
import { Calculator, DollarSign, TrendingUp, PieChart, ArrowRight } from 'lucide-react';

interface FinancialMetrics {
  revenue: number;
  expenses: number;
  profit: number;
  margin: number;
}

function FinancialProjections() {
  const [inputs, setInputs] = useState({
    avgPrice: 0,
    customersPerMonth: 0,
    fixedCosts: 0,
    variableCostPerUnit: 0,
  });

  const [metrics, setMetrics] = useState<FinancialMetrics>({
    revenue: 0,
    expenses: 0,
    profit: 0,
    margin: 0,
  });

  const calculateProjections = () => {
    const monthlyRevenue = inputs.avgPrice * inputs.customersPerMonth;
    const annualRevenue = monthlyRevenue * 12;
    
    const variableCosts = inputs.variableCostPerUnit * inputs.customersPerMonth * 12;
    const annualCosts = variableCosts + (inputs.fixedCosts * 12);
    
    const annualProfit = annualRevenue - annualCosts;
    const profitMargin = (annualProfit / annualRevenue) * 100;

    setMetrics({
      revenue: annualRevenue,
      expenses: annualCosts,
      profit: annualProfit,
      margin: profitMargin,
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center space-x-2 mb-6">
        <Calculator className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold text-gray-900">First Year Financial Projections</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Average Price Per Customer
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                value={inputs.avgPrice}
                onChange={(e) => setInputs({ ...inputs, avgPrice: Number(e.target.value) })}
                className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Customers per Month
            </label>
            <input
              type="number"
              min="0"
              value={inputs.customersPerMonth}
              onChange={(e) => setInputs({ ...inputs, customersPerMonth: Number(e.target.value) })}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Fixed Costs
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                value={inputs.fixedCosts}
                onChange={(e) => setInputs({ ...inputs, fixedCosts: Number(e.target.value) })}
                className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variable Cost per Customer
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="number"
                min="0"
                value={inputs.variableCostPerUnit}
                onChange={(e) => setInputs({ ...inputs, variableCostPerUnit: Number(e.target.value) })}
                className="pl-8 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
          </div>

          <button
            onClick={calculateProjections}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Calculator className="h-4 w-4" />
            <span>Calculate Projections</span>
          </button>
        </div>

        {/* Results Section */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-indigo-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-medium text-gray-600">Annual Revenue</span>
            </div>
            <p className="text-lg font-semibold text-indigo-600">
              {formatCurrency(metrics.revenue)}
            </p>
          </div>

          <div className="p-4 bg-red-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <ArrowRight className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-gray-600">Annual Expenses</span>
            </div>
            <p className="text-lg font-semibold text-red-600">
              {formatCurrency(metrics.expenses)}
            </p>
          </div>

          <div className="p-4 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Annual Profit</span>
            </div>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(metrics.profit)}
            </p>
          </div>

          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">Profit Margin</span>
            </div>
            <p className="text-lg font-semibold text-purple-600">
              {metrics.margin.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FinancialProjections; 