
import { supabase as defaultSupabase } from "@/integrations/supabase/client";
import { createClient } from '@supabase/supabase-js';
import { Prompt, Tag } from "@/types";

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
    const { data, error } = await supabase
      .from('prompts')
      .select('*');
    
    if (error) {
      console.error("Error fetching prompts from Supabase:", error);
      return [];
    }
    
    if (!data) {
      return [];
    }
    
    // Transform data to match our Prompt type
    return data.map(item => ({
      id: item.id,
      text: item.content || '', // Map content to text
      tags: Array.isArray(item.tags) ? item.tags.map(tagName => ({
        id: tagName, // Using the tag name as the ID
        name: tagName
      })) : [],
      createdAt: item.createdat || new Date().toISOString(),
      type: item.category || 'task' // Map category to type
    }));
  } catch (err) {
    console.error("Exception while fetching prompts:", err);
    return [];
  }
};

export const savePromptToSupabase = async (prompt: Prompt): Promise<boolean> => {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('prompts')
      .upsert({
        id: prompt.id,
        content: prompt.text, // Map text to content
        tags: prompt.tags.map(tag => tag.id), // Convert Tag objects to string IDs
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
