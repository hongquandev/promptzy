
import { supabase as defaultSupabase } from "@/integrations/supabase/client";
import { createClient } from '@supabase/supabase-js';
import { Prompt, Tag } from "@/types";

// Define a simple table interface for our expected Supabase schema
interface PromptsTable {
  id: string;
  content: string;
  tags: string[];
  createdat: string;
  title: string;
  category: string;
  description: string;
  user_id: string;
  ispublic: boolean;
  likes: number;
  views: number;
  comments: number;
}

// Function to check if the prompts table exists and create it if it doesn't
const ensurePromptsTable = async (supabase: any) => {
  try {
    // Check if the table exists by querying for a single row
    const { error } = await supabase.from('prompts').select('id').limit(1);
    
    if (error && error.code === '42P01') { // PostgreSQL error code for undefined table
      console.log("Prompts table doesn't exist. Creating it...");
      // Table doesn't exist, create it
      const createTableSql = `
        CREATE TABLE IF NOT EXISTS prompts (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          content TEXT NOT NULL,
          tags TEXT[] DEFAULT '{}',
          createdat TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          title TEXT,
          category TEXT DEFAULT 'task',
          description TEXT DEFAULT '',
          user_id TEXT NOT NULL,
          ispublic BOOLEAN DEFAULT false,
          likes INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          comments INTEGER DEFAULT 0
        );
      `;
      
      // Execute the SQL through Supabase's RPC function
      const { error: createError } = await supabase.rpc('execute_sql', { 
        sql: createTableSql 
      });
      
      if (createError) {
        console.error("Error creating prompts table:", createError);
      }
    }
  } catch (err) {
    console.error("Error checking or creating prompts table:", err);
  }
};

// Function to get the appropriate Supabase client
const getSupabaseClient = () => {
  const customUrl = localStorage.getItem('custom-supabase-url');
  const customKey = localStorage.getItem('custom-supabase-key');
  
  if (customUrl && customKey) {
    return createClient(customUrl, customKey);
  }
  
  return defaultSupabase;
};

export const getPromptsFromSupabase = async (): Promise<Prompt[]> => {
  const supabase = getSupabaseClient();
  
  try {
    await ensurePromptsTable(supabase);

    const { data, error } = await supabase
      .from('prompts')
      .select('*');
    
    if (error) {
      console.error("Error fetching prompts from Supabase:", error);
      return [];
    }
    
    if (!data || !Array.isArray(data)) {
      return [];
    }
    
    // Transform data to match our Prompt type
    return data.map((item: PromptsTable) => ({
      id: item.id || '',
      text: item.content || '', // Map content to text
      tags: Array.isArray(item.tags) ? item.tags.map((tagName: string) => ({
        id: tagName, // Using the tag name as the ID
        name: tagName
      })) : [],
      createdAt: item.createdat || new Date().toISOString(),
      type: (item.category as "task" | "system") || 'task' // Map category to type
    }));
  } catch (err) {
    console.error("Exception while fetching prompts:", err);
    return [];
  }
};

export const savePromptToSupabase = async (prompt: Prompt): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  try {
    await ensurePromptsTable(supabase);

    const { error } = await supabase
      .from('prompts')
      .upsert({
        id: prompt.id,
        content: prompt.text, // Map text to content
        tags: prompt.tags.map(tag => tag.name), // Convert Tag objects to string names
        createdat: prompt.createdAt,
        title: prompt.text.substring(0, 50), // Use first 50 chars of text as title
        category: prompt.type || 'task',
        description: '',
        user_id: 'anonymous', // Default user ID
        ispublic: false,
        likes: 0,
        views: 0,
        comments: 0
      });
    
    if (error) {
      console.error("Error saving prompt to Supabase:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception while saving prompt:", err);
    return false;
  }
};

export const deletePromptFromSupabase = async (id: string): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  try {
    await ensurePromptsTable(supabase);

    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Error deleting prompt from Supabase:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Exception while deleting prompt:", err);
    return false;
  }
};

export const syncPromptsToSupabase = async (localPrompts: Prompt[]): Promise<void> => {
  for (const prompt of localPrompts) {
    await savePromptToSupabase(prompt);
  }
};

// Helper function to check connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  try {
    // A simple query to test the connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }
    
    return true;
  } catch (err) {
    console.error("Supabase connection test exception:", err);
    return false;
  }
};
