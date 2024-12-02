export const blogPosts = [
  {
    id: '1',
    title: 'The Ultimate Guide to Startup Validation',
    excerpt: 'Learn proven methods to validate your startup idea before investing time and resources.',
    content: '...',
    author: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      role: 'CEO'
    },
    date: '2024-01-25',
    readTime: '8 min',
    category: 'Startup Tips',
    tags: ['Validation', 'Market Research', 'Planning'],
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    featured: true
  },
  // Add more blog posts here...
] as const; 