import React, { useState } from 'react';
import { 
  Briefcase, 
  MapPin, 
  Clock, 
  Coffee,
  Globe,
  Heart,
  Laptop,
  Zap,
  Users,
  GraduationCap,
  DollarSign,
  Plane
} from 'lucide-react';

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
  posted: string;
}

const CareersPage: React.FC = () => {
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  const benefits = [
    {
      icon: Globe,
      title: 'Remote-First',
      description: 'Work from anywhere in the world'
    },
    {
      icon: Heart,
      title: 'Healthcare',
      description: 'Comprehensive health, dental, and vision coverage'
    },
    {
      icon: Laptop,
      title: 'Equipment',
      description: 'Latest tech setup of your choice'
    },
    {
      icon: GraduationCap,
      title: 'Learning',
      description: 'Annual learning & development budget'
    },
    {
      icon: DollarSign,
      title: 'Equity',
      description: 'Competitive equity package'
    },
    {
      icon: Plane,
      title: 'Time Off',
      description: 'Unlimited PTO and paid parental leave'
    }
  ];

  const jobs: JobPosting[] = [
    {
      id: '1',
      title: 'Senior Full Stack Engineer',
      department: 'Engineering',
      location: 'Remote',
      type: 'Full-time',
      description: 'Join our core team building the future of startup creation.',
      requirements: [
        '5+ years of experience with modern web technologies',
        'Strong background in React and TypeScript',
        'Experience with AI/ML integration',
        'Track record of building scalable applications'
      ],
      posted: '2024-01-15'
    },
    {
      id: '2',
      title: 'AI Research Scientist',
      department: 'AI',
      location: 'San Francisco',
      type: 'Full-time',
      description: 'Help develop our next-generation AI algorithms.',
      requirements: [
        'PhD in Machine Learning or related field',
        'Published research in NLP or generative AI',
        'Experience with large language models',
        'Strong programming skills in Python'
      ],
      posted: '2024-01-20'
    },
    {
      id: '3',
      title: 'Product Marketing Manager',
      department: 'Marketing',
      location: 'New York',
      type: 'Full-time',
      description: 'Drive our product marketing strategy and execution.',
      requirements: [
        '4+ years of B2B SaaS product marketing experience',
        'Strong analytical and communication skills',
        'Experience with go-to-market strategy',
        'Track record of successful product launches'
      ],
      posted: '2024-01-25'
    }
  ];

  const departments = ['all', ...new Set(jobs.map(job => job.department))];
  const locations = ['all', ...new Set(jobs.map(job => job.location))];

  const filteredJobs = jobs.filter(job => {
    const matchesDepartment = selectedDepartment === 'all' || job.department === selectedDepartment;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    return matchesDepartment && matchesLocation;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow">
        {/* Hero Section */}
        <div className="bg-indigo-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl md:text-2xl text-indigo-100 max-w-3xl mx-auto">
              Help us revolutionize how startups are built and scaled
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Culture Section */}
          <div className="mb-20 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Our Culture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We're building a diverse, inclusive team of passionate individuals who want to make 
              a difference in the startup ecosystem. Our culture is built on innovation, 
              collaboration, and continuous learning.
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Benefits & Perks
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <benefit.icon className="w-6 h-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {benefit.title}
                      </h3>
                      <p className="text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Positions */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Open Positions
            </h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-8">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>
                    {dept === 'all' ? 'All Departments' : dept}
                  </option>
                ))}
              </select>

              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              >
                {locations.map(loc => (
                  <option key={loc} value={loc}>
                    {loc === 'all' ? 'All Locations' : loc}
                  </option>
                ))}
              </select>
            </div>

            {/* Job Listings */}
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <div key={job.id} className="bg-white rounded-xl shadow-md p-6">
                  <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Briefcase className="w-4 h-4 mr-1" />
                          {job.department}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {job.type}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => {/* Add application logic */}}
                      className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Apply Now
                    </button>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {job.description}
                  </p>

                  <div className="space-y-2">
                    <h4 className="font-medium text-gray-900">Requirements:</h4>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {job.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* No Positions Available Section */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">
              No positions available matching your criteria. Please try different filters or check back later.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareersPage; 