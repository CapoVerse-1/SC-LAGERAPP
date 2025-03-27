'use client';

import { supabase } from './supabase';

// Define the bucket type
interface Bucket {
  id: string;
  name: string;
  owner: string;
  public: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Creates a storage bucket if it doesn't already exist
 * @param name The name of the bucket to create
 * @param isPublic Whether the bucket should be public
 */
export async function createBucketIfNotExists(name: string, isPublic = true): Promise<void> {
  try {
    // First check if the bucket exists
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error listing buckets:', listError);
      throw listError;
    }
    
    // Check if our bucket already exists
    const bucketExists = buckets.some((bucket: Bucket) => bucket.name === name);
    
    if (!bucketExists) {
      console.log(`Creating bucket: ${name}`);
      const { error: createError } = await supabase.storage.createBucket(name, {
        public: isPublic,
      });
      
      if (createError) {
        console.error(`Error creating bucket ${name}:`, createError);
        throw createError;
      }
      
      console.log(`Successfully created bucket: ${name}`);
    } else {
      console.log(`Bucket ${name} already exists`);
    }
  } catch (error) {
    console.error(`Failed to set up bucket ${name}:`, error);
    throw error;
  }
}

/**
 * Sets up all required storage buckets for the application
 */
export async function setupAllBuckets(): Promise<void> {
  try {
    // Create the buckets we need
    await createBucketIfNotExists('brand-logos');
    await createBucketIfNotExists('item-images');
    await createBucketIfNotExists('promoter-photos');
    
    console.log('All storage buckets initialized successfully');
  } catch (error) {
    console.error('Failed to initialize storage buckets:', error);
    throw error;
  }
} 