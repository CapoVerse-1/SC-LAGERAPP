'use client';

import { useEffect, useState } from 'react';
import { setupAllBuckets } from '@/lib/setupStorage';
import { toast } from '@/components/ui/use-toast';

export default function StorageInitializer() {
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const initializeStorage = async () => {
      try {
        if (!initialized) {
          await setupAllBuckets();
          setInitialized(true);
          console.log('Storage buckets initialized');
        }
      } catch (err) {
        console.error('Failed to initialize storage:', err);
        setError(err instanceof Error ? err : new Error('Unknown error initializing storage'));
        toast({
          title: 'Storage Initialization Error',
          description: 'There was a problem setting up storage. Some features may not work.',
          variant: 'destructive',
        });
      }
    };

    initializeStorage();
  }, [initialized]);

  // This component doesn't render anything visible
  return null;
} 