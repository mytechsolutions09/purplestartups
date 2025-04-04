// Netlify serverless function to provide trending keywords
// This can be updated separately from the main app code

exports.handler = async function(event, context) {
  // You could fetch from an external API or database here
  // For now, we'll return a predefined list that can be easily updated
  
  const trendingKeywords = [
    // Technology & AI
    { id: '1', text: 'AI-driven climate solutions', category: 'tech', popularity: 95 },
    { id: '2', text: 'synthetic biology applications', category: 'biotech', popularity: 92 },
    { id: '3', text: 'quantum machine learning', category: 'tech', popularity: 90 },
    { id: '4', text: 'neuromorphic computing', category: 'tech', popularity: 88 },
    { id: '5', text: 'generative design tools', category: 'design', popularity: 86 },
    
    // Sustainability & Environment
    { id: '6', text: 'vertical farming automation', category: 'agriculture', popularity: 89 },
    { id: '7', text: 'ocean plastic remediation', category: 'environment', popularity: 87 },
    { id: '8', text: 'circular economy marketplaces', category: 'business', popularity: 85 },
    { id: '9', text: 'carbon capture technology', category: 'environment', popularity: 91 },
    { id: '10', text: 'sustainable fashion tech', category: 'retail', popularity: 83 },
    
    // Health & Wellness
    { id: '11', text: 'digital therapeutic solutions', category: 'health', popularity: 89 },
    { id: '12', text: 'longevity research platforms', category: 'health', popularity: 86 },
    { id: '13', text: 'mental health prediction apps', category: 'health', popularity: 90 },
    { id: '14', text: 'microbiome optimization', category: 'health', popularity: 84 },
    { id: '15', text: 'telemedicine for underserved areas', category: 'health', popularity: 88 },
    
    // Future of Work & Society
    { id: '16', text: 'skill-based talent marketplaces', category: 'work', popularity: 87 },
    { id: '17', text: 'AR workplace collaboration', category: 'work', popularity: 85 },
    { id: '18', text: 'decentralized autonomous organizations', category: 'business', popularity: 89 },
    { id: '19', text: 'drone delivery networks', category: 'logistics', popularity: 83 },
    { id: '20', text: 'space tourism infrastructure', category: 'travel', popularity: 81 },
    
    // Finance & Commerce
    { id: '21', text: 'tokenized real estate investing', category: 'finance', popularity: 84 },
    { id: '22', text: 'subscription-based product services', category: 'business', popularity: 82 },
    { id: '23', text: 'voice commerce technology', category: 'retail', popularity: 80 },
    { id: '24', text: 'embedded financial services', category: 'finance', popularity: 85 },
    { id: '25', text: 'community-owned digital infrastructure', category: 'tech', popularity: 81 }
  ];
  
  // Sort by popularity (optional)
  const sortedKeywords = [...trendingKeywords].sort((a, b) => 
    (b.popularity || 0) - (a.popularity || 0)
  );

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      // Add caching headers to reduce load
      'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
    },
    body: JSON.stringify({
      keywords: sortedKeywords,
      updated: new Date().toISOString(),
      source: 'netlify function'
    })
  };
}; 