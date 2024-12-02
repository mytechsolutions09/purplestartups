import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { useStorePage } from '../contexts/StorePageContext';
import { useSavedPlans } from '../contexts/SavedPlansContext';
import { Link, useNavigate } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import "react-datepicker/dist/react-datepicker.css";

type SortOrder = 'newest' | 'oldest';

function StorePage() {
  const { storedPlan } = useStorePage();
  const { savedPlans } = useSavedPlans();
  const navigate = useNavigate();
  const [sortOrder, setSortOrder] = useState<SortOrder>('newest');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  // Filter and sort plans based on selected dates and order
  const filteredAndSortedPlans = [...savedPlans]
    .filter(plan => {
      if (!startDate && !endDate) return true;
      const planDate = new Date(plan.timestamp);
      if (startDate && endDate) {
        return planDate >= startDate && planDate <= endDate;
      }
      if (startDate) {
        return planDate >= startDate;
      }
      if (endDate) {
        return planDate <= endDate;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return b.timestamp - a.timestamp;
      }
      return a.timestamp - b.timestamp;
    });

  const clearDates = () => {
    setStartDate(null);
    setEndDate(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header with Filters */}
          <div className="mb-8 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Saved Plans</h1>
                <p className="mt-2 text-gray-600">
                  View and manage your saved startup plans
                </p>
              </div>
            </div>

            {savedPlans.length > 0 && (
              <div className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
                {/* Date Range Picker */}
                <div className="flex items-center space-x-2">
                  <Icons.Calendar className="h-5 w-5 text-gray-500" />
                  <div className="flex items-center space-x-2">
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Start Date"
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    <span className="text-gray-500">to</span>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="End Date"
                      className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>

                {/* Sort Order */}
                <div className="flex items-center space-x-2">
                  <Icons.ArrowUpDown className="h-5 w-5 text-gray-500" />
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                    className="block w-40 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                  </select>
                </div>

                {/* Clear Filters */}
                {(startDate || endDate) && (
                  <button
                    onClick={clearDates}
                    className="flex items-center space-x-1 text-indigo-600 hover:text-indigo-800"
                  >
                    <Icons.X className="h-4 w-4" />
                    <span>Clear dates</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Current Plan */}
          {storedPlan && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Plan</h2>
              <Link 
                to={storedPlan.path}
                className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
              >
                <h3 className="text-lg font-semibold text-gray-800">
                  {storedPlan.idea}
                </h3>
                <p className="text-gray-600">
                  Generated on: {new Date(storedPlan.timestamp).toLocaleDateString()}
                </p>
                <div className="mt-2 text-indigo-600 flex items-center">
                  <span>View plan</span>
                  <Icons.ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Link>
            </div>
          )}

          {/* Filtered Plans */}
          {filteredAndSortedPlans.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Previous Plans {startDate || endDate ? '(Filtered)' : ''}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedPlans.map((plan) => (
                  <Link 
                    key={plan.id}
                    to={`/roadmap?idea=${encodeURIComponent(plan.idea)}`}
                    className="block p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:border-indigo-500 transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-gray-800">
                      {plan.idea}
                    </h3>
                    <p className="text-gray-600">
                      Saved on: {new Date(plan.timestamp).toLocaleDateString()}
                    </p>
                    <div className="mt-2 text-indigo-600 flex items-center">
                      <span>View plan</span>
                      <Icons.ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {savedPlans.length === 0 && !storedPlan && (
            <div className="text-center py-12">
              <Icons.FileQuestion className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">No saved plans</h3>
              <p className="mt-2 text-gray-600">
                Generate a new startup plan to get started
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default StorePage; 