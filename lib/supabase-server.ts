'use server';

import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import type { Database } from '@/types/supabase';

export async function createServerSupabaseClient() {
  console.log('Creating server-side Supabase client...');
  
  try {
    const cookieStore = await cookies();
    
    console.log('Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    // We don't log the anon key for security reasons
    
    const client = createServerClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            try {
              cookieStore.set(name, value, options);
            } catch (error) {
              console.error('Error setting cookie:', error);
              // This might fail in middleware or other contexts
              // We can safely ignore it since we're using this primarily for reading the session
            }
          },
          remove(name, options) {
            try {
              cookieStore.set(name, '', { ...options, maxAge: 0 });
            } catch (error) {
              console.error('Error removing cookie:', error);
              // This might fail in middleware or other contexts
              // We can safely ignore it since we're using this primarily for reading the session
            }
          },
        },
      }
    );
    
    console.log('Server-side Supabase client created successfully');
    return client;
  } catch (error) {
    console.error('Failed to create server-side Supabase client:', error);
    throw error;
  }
} 