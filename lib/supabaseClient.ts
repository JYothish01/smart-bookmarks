import { createClient } from '@supabase/supabase-js'

// Export a function to create a new Supabase client instance per request/component
export function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}