import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

function PageWrapper({ children }: PageWrapperProps) {
  return (
    <div className="min-h-screen pt-20 pb-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
}

export default PageWrapper; 