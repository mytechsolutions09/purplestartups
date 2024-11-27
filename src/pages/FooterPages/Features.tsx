import React from 'react';

function Features() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold mb-8">Features</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">AI-Powered Analysis</h2>
          <p>Detailed analysis of your startup idea using advanced AI algorithms</p>
        </div>
        {/* Add more feature sections */}
      </div>
    </div>
  );
}

export default Features; 