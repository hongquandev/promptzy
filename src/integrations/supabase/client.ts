// This file provides the Supabase client with both default and custom configurations.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default Supabase configuration - used as fallback
const DEFAULT_SUPABASE_URL = "https://hxxaymvjwvzmmjekoxsk.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eGF5bXZqd3Z6bW1qZWtveHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTY1NjksImV4cCI6MjA2Mjc3MjU2OX0.VyrQ5l6j5DPG6kn6FwpChXbn13lEbCEDrovbGTFkEkw";

// Storage keys for Supabase credentials
export const SUPABASE_URL_KEY = 'custom-supabase-url';
export const SUPABASE_KEY_KEY = 'custom-supabase-key';

// Helper function to get the current Supabase URL and key
export const getSupabaseCredentials = () => {
  try {
    // Try to get custom credentials from localStorage
    const customUrl = localStorage.getItem(SUPABASE_URL_KEY);
    const customKey = localStorage.getItem(SUPABASE_KEY_KEY);

    // Use custom values if they exist, otherwise fall back to defaults
    return {
      supabaseUrl: customUrl || DEFAULT_SUPABASE_URL,
      supabaseKey: customKey || DEFAULT_SUPABASE_KEY
    };
  } catch (error) {
    console.error("Error retrieving Supabase credentials from localStorage:", error);
    // Fall back to defaults if localStorage is not available or throws an error
    return {
      supabaseUrl: DEFAULT_SUPABASE_URL,
      supabaseKey: DEFAULT_SUPABASE_KEY
    };
  }
};

// Function to clear custom Supabase credentials and revert to defaults
export const clearSupabaseCredentials = () => {
  try {
    localStorage.removeItem(SUPABASE_URL_KEY);
    localStorage.removeItem(SUPABASE_KEY_KEY);
    console.log("Supabase credentials cleared, reverting to defaults");
    return true;
  } catch (error) {
    console.error("Error clearing Supabase credentials:", error);
    return false;
  }
};

// Function to save Supabase credentials to localStorage
export const saveSupabaseCredentials = (url: string, key: string) => {
  try {
    localStorage.setItem(SUPABASE_URL_KEY, url);
    localStorage.setItem(SUPABASE_KEY_KEY, key);
    console.log("Supabase credentials saved to localStorage");
    return true;
  } catch (error) {
    console.error("Error saving Supabase credentials:", error);
    return false;
  }
};

// Create Supabase client with current credentials
let supabaseClient: ReturnType<typeof createClient<Database>>;

// Initialize the client lazily to ensure we have the latest credentials
const initializeClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials();

  // Create client with options for better error handling
  supabaseClient = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });

  return supabaseClient;
};

// Export the supabase client, initializing it if needed
export const supabase = initializeClient();

// Function to create a new client with the latest credentials
// Use this when credentials have been updated and a new client is needed
export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials();

  // Create client with options for better error handling
  return createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
};