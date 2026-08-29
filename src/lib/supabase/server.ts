import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  process.env.SUPABASE_URL ||
  'https://cswdcbruzgdqburynlop.supabase.co';

const supabaseKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzd2RjYnJ1emdkcWJ1cnlubG9wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyOTk5NzYsImV4cCI6MjEwMjg3NTk3Nn0.57dm65p13c5CbQu9EIqT-S1WikQsTU5xob8-bLQJNhw';

export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
    },
  });
};
