import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

interface Keyword {
  id: number;
  text: string;
  clicks: number;
  created_at: string;
  active: boolean;
}

export function useTrendingKeywords() {
  const [keywords, setKeywords] = useState<Keyword[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKeywords() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('trending_keywords')
          .select('*')
          .eq('active', true)
          .order('clicks', { ascending: false })
          .limit(50);
        
        if (error) throw error;
        
        setKeywords(data || []);
      } catch (err: any) {
        console.error('Error fetching trending keywords:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchKeywords();
  }, []);

  const incrementKeywordClick = async (keywordId: number) => {
    try {
      // Update the clicks count in the database
      const { error } = await supabase
        .from('trending_keywords')
        .update({ clicks: supabase.rpc('increment', { x: 1 }) })
        .eq('id', keywordId);
      
      if (error) throw error;
      
      // Optimistically update the local state
      setKeywords(keywords.map(kw => 
        kw.id === keywordId ? { ...kw, clicks: kw.clicks + 1 } : kw
      ));
      
    } catch (err: any) {
      console.error('Error incrementing keyword click:', err);
    }
  };

  return { keywords, loading, error, incrementKeywordClick };
} 