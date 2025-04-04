-- Create a function to increment a counter
CREATE OR REPLACE FUNCTION increment(x integer) RETURNS integer AS $$
BEGIN
  RETURN x + 1;
END;
$$ LANGUAGE plpgsql; 