
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
