import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Filter, Search, MoreVertical } from 'lucide-react';
import { generateStartupPlanWithAI, generateCRMData } from '../utils/api';
import type { StartupPlan, Contact, CRMData } from '../types';

interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'select' | 'date';
  options?: string[]; // For select type fields
}

function CRMPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const idea = searchParams.get('idea');
  const [plan, setPlan] = useState<StartupPlan | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [customFields, setCustomFields] = useState<CustomField[]>([]);
  const [showAddContact, setShowAddContact] = useState(false);
  const [crmData, setCRMData] = useState<CRMData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!idea) {
      navigate('/roadmap');
      return;
    }

    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // First get the plan to ensure we have the complete idea context
        const generatedPlan = await generateStartupPlanWithAI(idea);
        setPlan(generatedPlan);

        // Then generate CRM data based on the complete plan
        const generatedCRMData = await generateCRMData(generatedPlan.idea);
        setCRMData(generatedCRMData);
        setContacts(generatedCRMData.contacts || []);
        
        // Generate custom fields based on the complete plan
        generateCustomFields(generatedPlan.idea, generatedCRMData.customFields);
      } catch (error) {
        console.error('Failed to load data:', error);
        setError(error instanceof Error ? error.message : 'Failed to load CRM data');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [idea, navigate]);

  const generateCustomFields = (idea: string, apiCustomFields?: CustomField[]) => {
    if (apiCustomFields && apiCustomFields.length > 0) {
      setCustomFields(apiCustomFields);
      return;
    }

    // Fallback to existing field generation logic
    const baseFields: CustomField[] = [
      { id: 'name', name: 'Name', type: 'text' },
      { id: 'email', name: 'Email', type: 'text' },
      { id: 'phone', name: 'Phone', type: 'text' },
      { id: 'status', name: 'Status', type: 'select', options: ['Lead', 'Prospect', 'Customer', 'Churned'] },
      { id: 'source', name: 'Source', type: 'select', options: ['Website', 'Referral', 'Social Media', 'Direct'] },
      { id: 'lastContact', name: 'Last Contact', type: 'date' },
    ];

    // Dynamic fields based on business type
    const ideaLower = idea.toLowerCase();
    let businessSpecificFields: CustomField[] = [];

    if (ideaLower.includes('real estate') || ideaLower.includes('property')) {
      businessSpecificFields = [
        { id: 'propertyType', name: 'Property Type', type: 'select', options: ['Virtual Land', 'Virtual Building', 'Virtual Space'] },
        { id: 'budget', name: 'Budget', type: 'number' },
        { id: 'preferredLocation', name: 'Preferred Metaverse', type: 'select', options: ['Decentraland', 'The Sandbox', 'Other'] },
      ];
    } else if (ideaLower.includes('tech') || ideaLower.includes('software') || ideaLower.includes('app')) {
      businessSpecificFields = [
        { id: 'companySize', name: 'Company Size', type: 'select', options: ['1-10', '11-50', '51-200', '201+'] },
        { id: 'currentSolution', name: 'Current Solution', type: 'text' },
        { id: 'technicalRequirements', name: 'Technical Requirements', type: 'text' },
      ];
    } else if (ideaLower.includes('retail') || ideaLower.includes('shop') || ideaLower.includes('store')) {
      businessSpecificFields = [
        { id: 'preferredProducts', name: 'Preferred Products', type: 'text' },
        { id: 'purchaseFrequency', name: 'Purchase Frequency', type: 'select', options: ['Weekly', 'Monthly', 'Quarterly', 'Yearly'] },
        { id: 'averageOrderValue', name: 'Average Order Value', type: 'number' },
      ];
    } else if (ideaLower.includes('service') || ideaLower.includes('consulting')) {
      businessSpecificFields = [
        { id: 'serviceInterest', name: 'Service Interest', type: 'text' },
        { id: 'industry', name: 'Industry', type: 'text' },
        { id: 'decisionMaker', name: 'Decision Maker', type: 'select', options: ['Yes', 'No'] },
      ];
    } else {
      // Default fields for other business types
      businessSpecificFields = [
        { id: 'interest', name: 'Interest Level', type: 'select', options: ['High', 'Medium', 'Low'] },
        { id: 'notes', name: 'Notes', type: 'text' },
        { id: 'followUpDate', name: 'Follow-up Date', type: 'date' },
      ];
    }

    setCustomFields([...baseFields, ...businessSpecificFields]);
  };

  const handleAddContact = (formData: any) => {
    const newContact: Contact = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      ...formData
    };

    setContacts(prev => [...prev, newContact]);
    setShowAddContact(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CRM data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center text-red-600">
          <p>{error}</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={() => setShowAddContact(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Contact</span>
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <div className="flex space-x-4">
            <div className="flex-1 relative">
              <Search className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {customFields.map((field) => (
                  <th
                    key={field.id}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {field.name}
                  </th>
                ))}
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.map((contact, index) => (
                <tr key={index}>
                  {customFields.map((field) => (
                    <td key={field.id} className="px-6 py-4 whitespace-nowrap">
                      {contact[field.id as keyof Contact]}
                    </td>
                  ))}
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Contact Modal */}
      {showAddContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Contact</h2>
            <form className="space-y-4">
              {customFields.map((field) => (
                <div key={field.id}>
                  <label className="block text-sm font-medium text-gray-700">
                    {field.name}
                  </label>
                  {field.type === 'select' ? (
                    <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm">
                      {field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    />
                  )}
                </div>
              ))}
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowAddContact(false)}
                  className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Add Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CRMPage; 