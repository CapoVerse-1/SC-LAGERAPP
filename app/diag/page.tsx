'use client';

import { useState, useEffect } from 'react';
import { testSupabaseConnection } from '@/lib/api/brands';
import { debugLog } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export default function DiagPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [envVars, setEnvVars] = useState({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not defined',
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
      ? `${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 10)}...` 
      : 'Not defined'
  });
  
  useEffect(() => {
    const runTests = async () => {
      try {
        debugLog('DiagPage: Starting diagnostic tests');
        setLoading(true);
        
        // Test authentication status
        const { data: { user } } = await supabase.auth.getUser();
        debugLog('DiagPage: Current user', user);
        
        // Run connection tests
        const testResults = await testSupabaseConnection();
        
        setResults({
          user: user,
          ...testResults,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error running tests:', error);
        debugLog('DiagPage: Test error', { error });
        setResults({
          error: error instanceof Error ? error.message : String(error),
          timestamp: new Date().toISOString()
        });
      } finally {
        setLoading(false);
      }
    };
    
    runTests();
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Supabase Diagnostic Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
        <div className="grid grid-cols-1 gap-2">
          <div><strong>NEXT_PUBLIC_SUPABASE_URL:</strong> {envVars.supabaseUrl}</div>
          <div><strong>NEXT_PUBLIC_SUPABASE_ANON_KEY:</strong> {envVars.supabaseAnonKey}</div>
        </div>
      </div>
      
      {loading ? (
        <div className="text-center p-4">Running diagnostic tests...</div>
      ) : results ? (
        <div className="bg-white p-4 border rounded">
          <h2 className="text-lg font-semibold mb-2">Test Results</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      ) : (
        <div className="text-red-500">No test results available</div>
      )}
    </div>
  );
} 