import { supabase, createSupabaseClient } from "@/integrations/supabase/client";
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

// SQL for table creation - separated for reuse
export const CREATE_TABLE_SQL = `
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

// Function to check if the prompts table exists
export const checkTableExists = async (client: any): Promise<boolean> => {
  try {
    const { error } = await client.from('prompts').select('id').limit(1);
    
    // If no error or error is not about missing table, the table exists
    if (!error || error.code !== '42P01') {
      return true;
    }
    
    return false;
  } catch (err) {
    console.error("Error checking if table exists:", err);
    return false;
  }
};

// Function to attempt to create the prompts table (but this will likely not work
// in most Supabase instances due to permission limitations)
export const createPromptsTable = async (client: any): Promise<{ success: boolean; error?: any }> => {
  try {
    // NOTE: Most Supabase instances do not allow direct SQL execution via the API
    // This is provided as a fallback but will likely fail in most environments
    console.log("Attempting to create prompts table, but this will likely fail due to permission restrictions...");
    
    // This is now just here for backwards compatibility but will likely fail
    const { error } = await client.rpc('execute_sql', { 
      sql: CREATE_TABLE_SQL
    });
    
    if (!error) {
      return { success: true };
    }
    
    console.error("Table creation failed as expected:", error);
    return { success: false, error };
  } catch (err) {
    console.error("Error creating prompts table:", err);
    return { success: false, error: err };
  }
};

// Function to check if the prompts table exists and create it if it doesn't
// (but creation will likely need to be done manually)
const ensurePromptsTable = async (client: any) => {
  try {
    // Check if table exists
    const tableExists = await checkTableExists(client);
    
    if (tableExists) {
      return true;
    }
    
    console.log("Prompts table doesn't exist. Manual creation will likely be required.");
    
    // Try to create the table automatically, but this will likely fail
    // due to permissions on most Supabase instances
    const { success } = await createPromptsTable(client);
    
    return tableExists || success;
  } catch (err) {
    console.error("Error checking or creating prompts table:", err);
    return false;
  }
};

// Get a fresh Supabase client with the latest credentials
const getClient = () => {
  return createSupabaseClient();
};

export const getPromptsFromSupabase = async (): Promise<Prompt[]> => {
  const client = getClient();
  
  try {
    const tableReady = await ensurePromptsTable(client);
    if (!tableReady) {
      console.error("Prompts table is not available");
      return [];
    }

    const { data, error } = await client
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
  const client = getClient();
  
  try {
    const tableReady = await ensurePromptsTable(client);
    if (!tableReady) {
      console.error("Prompts table is not available");
      return false;
    }

    // Get the current user session to get the user ID
    const { data: sessionData } = await client.auth.getSession();
    const userId = sessionData?.session?.user?.id || 'anonymous';

    const { error } = await client
      .from('prompts')
      .upsert({
        id: prompt.id,
        content: prompt.text, // Map text to content
        tags: prompt.tags.map(tag => tag.name), // Convert Tag objects to string names
        createdat: prompt.createdAt,
        title: prompt.text.substring(0, 50), // Use first 50 chars of text as title
        category: prompt.type || 'task',
        description: '',
        user_id: userId,
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
  const client = getClient();
  
  try {
    const tableReady = await ensurePromptsTable(client);
    if (!tableReady) {
      console.error("Prompts table is not available");
      return false;
    }

    const { error } = await client
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
  // Always create a new client to test with the latest credentials
  const client = getClient();
  
  try {
    // Attempt to get the current session as a connection test
    const { data, error } = await client.auth.getSession();
    
    if (error) {
      console.error("Supabase connection test failed:", error);
      return false;
    }
    
    // Check if the table exists - we'll consider this a successful connection
    // even if the table doesn't exist, as table creation will need to be manual
    const tableExists = await checkTableExists(client);
    
    return true;
  } catch (err) {
    console.error("Supabase connection test exception:", err);
    return false;
  }
};
