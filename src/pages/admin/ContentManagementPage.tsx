import React from 'react';

const ContentManagementPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Content Management</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Manage Website Content</h2>
        <p className="text-gray-600 mb-4">
          This is a placeholder for the content management system. From here, you would be able to:
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-2">
          <li>Edit homepage content</li>
          <li>Manage blog posts</li>
          <li>Update FAQs</li>
          <li>Edit legal pages (Terms, Privacy, etc.)</li>
          <li>Manage image assets</li>
        </ul>
        
        <div className="bg-yellow-50 p-4 rounded-md text-yellow-800">
          <p className="font-medium">Coming Soon</p>
          <p className="text-sm">Content management functionality is still in development.</p>
        </div>
      </div>
    </div>
  );
};

export default ContentManagementPage; 