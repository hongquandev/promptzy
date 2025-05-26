import { SYSTEM_PROMPT_DEFAULT } from "@/components/AIAssistant";

const SYSTEM_PROMPT_KEY = 'ai-system-prompt';
const USE_DEFAULT_PROMPT_KEY = 'ai-use-default-prompt';

export const getSystemPrompt = (): string => {
  // Check if we should use the default prompt
  const useDefault = localStorage.getItem(USE_DEFAULT_PROMPT_KEY);
  if (useDefault === 'true') {
    return SYSTEM_PROMPT_DEFAULT;
  }

  // Try to get custom prompt
  const storedPrompt = localStorage.getItem(SYSTEM_PROMPT_KEY);
  return storedPrompt || SYSTEM_PROMPT_DEFAULT;
};

export const saveSystemPrompt = (prompt: string): void => {
  localStorage.setItem(SYSTEM_PROMPT_KEY, prompt);
};

export const setUseDefaultPrompt = (useDefault: boolean): void => {
  localStorage.setItem(USE_DEFAULT_PROMPT_KEY, useDefault.toString());
};

export const isUsingDefaultPrompt = (): boolean => {
  const useDefault = localStorage.getItem(USE_DEFAULT_PROMPT_KEY);
  return useDefault === 'true';
};