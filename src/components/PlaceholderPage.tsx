import React from 'react';
import PageWrapper from './PageWrapper';

interface PlaceholderPageProps {
  title: string;
}

function PlaceholderPage({ title }: PlaceholderPageProps) {
  return (
    <PageWrapper>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">{title}</h1>
        <p className="text-gray-600">This page is coming soon.</p>
      </div>
    </PageWrapper>
  );
}

export default PlaceholderPage; 