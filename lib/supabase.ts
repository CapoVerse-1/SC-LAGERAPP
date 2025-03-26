'use client';

import { createBrowserClient } from '@supabase/ssr';

// Create a singleton instance for client-side usage
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    console.log('Initializing Supabase browser client with URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    // We don't log the anon key for security reasons
    
    supabaseInstance = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    
    console.log('Supabase browser client initialized successfully');
  }
  return supabaseInstance;
})(); 