'use client';

import { createBrowserClient } from '@supabase/ssr';

// Create a singleton instance for client-side usage
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance && typeof window !== 'undefined') {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase environment variables');
      throw new Error('Missing Supabase environment variables');
    }
    
    supabaseInstance = createBrowserClient(supabaseUrl, supabaseKey);
  }
  return supabaseInstance;
})(); 