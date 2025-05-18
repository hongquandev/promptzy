
import { Prompt, Tag } from "../types";

const PROMPTS_KEY = 'ai-prompts';
const TAGS_KEY = 'ai-tags';

export const getPrompts = (): Prompt[] => {
  const storedPrompts = localStorage.getItem(PROMPTS_KEY);
  return storedPrompts ? JSON.parse(storedPrompts) : [];
};

export const savePrompt = (prompt: Prompt): void => {
  const prompts = getPrompts();
  const existingIndex = prompts.findIndex(p => p.id === prompt.id);
  
  if (existingIndex >= 0) {
    // Update existing prompt
    prompts[existingIndex] = prompt;
  } else {
    // Add new prompt
    prompts.push(prompt);
  }
  
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  
  // Update tags storage
  const allTags = getUniqueTags(prompts);
  localStorage.setItem(TAGS_KEY, JSON.stringify(allTags));
};

export const deletePrompt = (id: string): void => {
  let prompts = getPrompts();
  prompts = prompts.filter(p => p.id !== id);
  localStorage.setItem(PROMPTS_KEY, JSON.stringify(prompts));
  
  // Update tags storage
  const allTags = getUniqueTags(prompts);
  localStorage.setItem(TAGS_KEY, JSON.stringify(allTags));
};

export const getAllTags = (): Tag[] => {
  const storedTags = localStorage.getItem(TAGS_KEY);
  return storedTags ? JSON.parse(storedTags) : [];
};

// Helper function to extract unique tags from prompts
export const getUniqueTags = (prompts: Prompt[]): Tag[] => {
  const tagMap = new Map<string, Tag>();
  
  prompts.forEach(prompt => {
    prompt.tags.forEach(tag => {
      tagMap.set(tag.id, tag);
    });
  });
  
  return Array.from(tagMap.values());
};
