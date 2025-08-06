export interface Tag {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  title?: string; // Optional title field
  text: string;
  tags: Tag[];
  createdAt: string;
  type?: "system" | "task" | "image" | "video"; // Optional type field
}

export interface AIResponse {
  text: string;
  loading: boolean;
  error: string | null;
}

export interface AIGenerateOptions {
  promptType: "system" | "task" | "image" | "video";
}
