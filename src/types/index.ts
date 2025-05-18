
export interface Tag {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  text: string;
  tags: Tag[];
  createdAt: string;
}

export interface AIResponse {
  text: string;
  loading: boolean;
  error: string | null;
}
