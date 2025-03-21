export const setupDatabase = async () => {
  const { error } = await supabase.rpc('exec_sql', {
    sql_query: `
      -- Create user_subscriptions table if it doesn't exist
      CREATE TABLE IF NOT EXISTS user_subscriptions (
        id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
        user_id uuid REFERENCES auth.users NOT NULL,
        plan text NOT NULL DEFAULT 'basic',
        plans_generated integer NOT NULL DEFAULT 0,
        plans_limit integer NOT NULL DEFAULT 2,
        reset_date timestamp with time zone NOT NULL,
        created_at timestamp with time zone DEFAULT now() NOT NULL,
        updated_at timestamp with time zone DEFAULT now() NOT NULL
      );
      
      -- Make sure each user only has one subscription record
      CREATE UNIQUE INDEX IF NOT EXISTS user_subscriptions_user_id_key ON user_subscriptions (user_id);
      
      -- Add a check constraint to ensure plans are one of the allowed values
      ALTER TABLE user_subscriptions 
        DROP CONSTRAINT IF EXISTS valid_plan_types;
      
      ALTER TABLE user_subscriptions 
        ADD CONSTRAINT valid_plan_types 
        CHECK (plan IN ('basic', 'pro', 'enterprise'));
    `
  });
  
  if (error) {
    console.error('Error setting up database:', error);
  }
}; 