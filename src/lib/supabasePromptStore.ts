
import { supabase } from "@/integrations/supabase/client";
import { Prompt, Tag } from "@/types";

export const getPromptsFromSupabase = async (): Promise<Prompt[]> => {
  const { data, error } = await supabase
    .from('prompts')
    .select('*');
  
  if (error) {
    console.error("Error fetching prompts from Supabase:", error);
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
    type: 'task' // Default type
  })) as Prompt[];
};

export const savePromptToSupabase = async (prompt: Prompt): Promise<boolean> => {
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
};

export const deletePromptFromSupabase = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('prompts')
    .delete()
    .eq('id', id);
  
  if (error) {
    console.error("Error deleting prompt from Supabase:", error);
    return false;
  }
  
  return true;
};

export const syncPromptsToSupabase = async (localPrompts: Prompt[]): Promise<void> => {
  for (const prompt of localPrompts) {
    await savePromptToSupabase(prompt);
  }
};
