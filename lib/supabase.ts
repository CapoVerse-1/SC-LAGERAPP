'use client';

import { createBrowserClient } from '@supabase/ssr';
import { debugLog } from './utils';

// Create a singleton instance for client-side usage
let supabaseInstance: ReturnType<typeof createBrowserClient> | null = null;

export const supabase = (() => {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    // Check for missing environment variables
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase environment variables:',  
        { 
          url: supabaseUrl ? 'defined' : 'missing', 
          key: supabaseAnonKey ? 'defined' : 'missing' 
        }
      );
    }
    
    debugLog('Creating Supabase client with:', {
      url: supabaseUrl ? supabaseUrl.substring(0, 20) + '...' : 'undefined',
      key: supabaseAnonKey ? supabaseAnonKey.substring(0, 10) + '...' : 'undefined'
    });
    
    supabaseInstance = createBrowserClient(
      supabaseUrl!,
      supabaseAnonKey!
    );
  }
  return supabaseInstance;
})(); 