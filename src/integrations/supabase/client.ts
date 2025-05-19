// This file provides the Supabase client with both default and custom configurations.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Default Supabase configuration - used as fallback
const DEFAULT_SUPABASE_URL = "https://hxxaymvjwvzmmjekoxsk.supabase.co";
const DEFAULT_SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh4eGF5bXZqd3Z6bW1qZWtveHNrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDcxOTY1NjksImV4cCI6MjA2Mjc3MjU2OX0.VyrQ5l6j5DPG6kn6FwpChXbn13lEbCEDrovbGTFkEkw";

// Helper function to get the current Supabase URL and key
export const getSupabaseCredentials = () => {
  // Try to get custom credentials from localStorage
  const customUrl = localStorage.getItem('custom-supabase-url');
  const customKey = localStorage.getItem('custom-supabase-key');
  
  // Use custom values if they exist, otherwise fall back to defaults
  return {
    supabaseUrl: customUrl || DEFAULT_SUPABASE_URL,
    supabaseKey: customKey || DEFAULT_SUPABASE_KEY
  };
};

// Create Supabase client with current credentials
const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// Function to create a new client with the latest credentials
// Use this when credentials have been updated and a new client is needed
export const createSupabaseClient = () => {
  const { supabaseUrl, supabaseKey } = getSupabaseCredentials();
  return createClient<Database>(supabaseUrl, supabaseKey);
};