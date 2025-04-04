-- Create the trending_keywords table
CREATE TABLE IF NOT EXISTS public.trending_keywords (
  id SERIAL PRIMARY KEY,
  text TEXT NOT NULL UNIQUE,
  clicks INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  active BOOLEAN DEFAULT TRUE
);

-- Add some initial keywords
INSERT INTO public.trending_keywords (text) VALUES
('metaverse technology'),
('sustainable fashion'),
('crypto gaming'),
('AI-powered healthcare'),
('quantum computing'),
('virtual events platform'),
('renewable energy solutions'),
('smart home automation'),
('NFT marketplace'),
('decentralized finance (DeFi)'),
('cybersecurity as a service'),
('remote work tools'),
('carbon footprint tracking'),
('personalized wellness apps'),
('green tech startups'),
('blockchain interoperability'),
('urban air mobility'),
('edtech for mental health'),
('inclusive fintech'),
('robotic process automation');

-- Ensure trending_keywords table has proper structure
ALTER TABLE IF EXISTS public.trending_keywords 
ADD COLUMN IF NOT EXISTS active BOOLEAN DEFAULT TRUE;

-- Create/update index for faster queries
CREATE INDEX IF NOT EXISTS trending_keywords_active_clicks_idx 
ON public.trending_keywords(active, clicks);

-- Add an example comment explaining the higher limit
COMMENT ON TABLE public.trending_keywords IS 'Stores up to 50 active trending keywords for display on the homepage'; 