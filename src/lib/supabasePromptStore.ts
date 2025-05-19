
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
  return data as Prompt[];
};

export const savePromptToSupabase = async (prompt: Prompt): Promise<boolean> => {
  const { error } = await supabase
    .from('prompts')
    .upsert({
      id: prompt.id,
      text: prompt.text,
      tags: prompt.tags,
      created_at: prompt.createdAt,
      type: prompt.type || 'task'
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
