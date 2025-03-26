import { supabase } from '../supabase';
import { Database } from '@/types/supabase';
import { debugLog } from '../utils';

export type Brand = Database['public']['Tables']['brands']['Row'];
export type CreateBrandData = Database['public']['Tables']['brands']['Insert'];
export type UpdateBrandData = Database['public']['Tables']['brands']['Update'];

/**
 * Test Supabase connection and permissions
 * @returns Promise with test results
 */
export async function testSupabaseConnection() {
  try {
    debugLog('testSupabaseConnection: Starting test');
    
    // Check authentication
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    const testResults = {
      authenticated: !!sessionData.session,
      sessionError: sessionError?.message,
      readPermission: false,
      writePermission: false,
      readError: null as string | null,
      writeError: null as string | null,
    };
    
    debugLog('testSupabaseConnection: Auth check', { 
      authenticated: testResults.authenticated,
      sessionError: sessionError 
    });
    
    // Test read permission
    try {
      const { data: readData, error: readError } = await supabase
        .from('brands')
        .select('*')
        .limit(1);
      
      testResults.readPermission = !readError;
      testResults.readError = readError?.message ?? null;
      
      debugLog('testSupabaseConnection: Read test', { 
        success: !readError, 
        error: readError,
        data: readData 
      });
    } catch (error: any) {
      testResults.readError = error.message;
      debugLog('testSupabaseConnection: Read test exception', { error });
    }
    
    // Only test write if authenticated
    if (testResults.authenticated) {
      try {
        const testBrand = {
          name: `Test Brand ${Date.now()}`,
          created_by: sessionData.session?.user.id,
        };
        
        const { data: writeData, error: writeError } = await supabase
          .from('brands')
          .insert([testBrand])
          .select()
          .single();
        
        testResults.writePermission = !writeError;
        testResults.writeError = writeError?.message ?? null;
        
        debugLog('testSupabaseConnection: Write test', { 
          success: !writeError, 
          error: writeError,
          data: writeData 
        });
        
        // Clean up test data
        if (writeData?.id) {
          await supabase.from('brands').delete().eq('id', writeData.id);
        }
      } catch (error: any) {
        testResults.writeError = error.message;
        debugLog('testSupabaseConnection: Write test exception', { error });
      }
    }
    
    debugLog('testSupabaseConnection: Final results', testResults);
    return testResults;
  } catch (error) {
    debugLog('testSupabaseConnection: Top-level exception', { error });
    console.error('Error testing Supabase connection:', error);
    throw error;
  }
}

/**
 * Fetch all brands from the database
 * @returns Promise with array of brands
 */
export async function fetchBrands(): Promise<Brand[]> {
  try {
    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .order('name');

    if (error) {
      console.error('Error fetching brands:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchBrands:', error);
    throw error;
  }
}

/**
 * Create a new brand
 * @param brandData Brand data to create
 * @returns Promise with the created brand
 */
export async function createBrand(brandData: CreateBrandData): Promise<Brand> {
  try {
    debugLog('createBrand: Starting to create brand', brandData);
    
    // Check if user is authenticated
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    
    debugLog('createBrand: Session check result', { 
      hasSession: !!sessionData.session,
      sessionError: sessionError
    });
    
    if (!sessionData.session) {
      throw new Error('Authentication required');
    }

    // Add created_by if not provided
    if (!brandData.created_by) {
      brandData.created_by = sessionData.session.user.id;
      debugLog('createBrand: Added created_by', { created_by: sessionData.session.user.id });
    }

    debugLog('createBrand: About to insert brand into Supabase');
    const { data, error } = await supabase
      .from('brands')
      .insert([brandData])
      .select()
      .single();

    if (error) {
      debugLog('createBrand: Supabase error', { error });
      console.error('Error creating brand:', error);
      throw new Error(error.message);
    }

    debugLog('createBrand: Successfully created brand', data);
    return data;
  } catch (error) {
    debugLog('createBrand: Caught exception', { error });
    console.error('Error in createBrand:', error);
    throw error;
  }
}

/**
 * Update an existing brand
 * @param id Brand ID
 * @param brandData Updated brand data
 * @returns Promise with the updated brand
 */
export async function updateBrand(id: string, brandData: UpdateBrandData): Promise<Brand> {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('Authentication required');
    }

    const { data, error } = await supabase
      .from('brands')
      .update(brandData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating brand:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in updateBrand:', error);
    throw error;
  }
}

/**
 * Toggle brand active status
 * @param id Brand ID
 * @param isActive New active status
 * @returns Promise with the updated brand
 */
export async function toggleBrandStatus(id: string, isActive: boolean): Promise<Brand> {
  return updateBrand(id, { is_active: isActive });
}

/**
 * Toggle brand pinned status
 * @param id Brand ID
 * @param isPinned New pinned status
 * @returns Promise with the updated brand
 */
export async function toggleBrandPinned(id: string, isPinned: boolean): Promise<Brand> {
  return updateBrand(id, { is_pinned: isPinned });
}

/**
 * Delete a brand
 * @param id Brand ID
 * @returns Promise with success status
 */
export async function deleteBrand(id: string): Promise<void> {
  try {
    // Check if user is authenticated
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) {
      throw new Error('Authentication required');
    }

    const { error } = await supabase
      .from('brands')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting brand:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteBrand:', error);
    throw error;
  }
}

/**
 * Count items for a brand
 * @param brandId Brand ID
 * @returns Promise with the count of items
 */
export async function countBrandItems(brandId: string): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('items')
      .select('*', { count: 'exact', head: true })
      .eq('brand_id', brandId);

    if (error) {
      console.error('Error counting brand items:', error);
      throw new Error(error.message);
    }

    return count || 0;
  } catch (error) {
    console.error('Error in countBrandItems:', error);
    throw error;
  }
} 