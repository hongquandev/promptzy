
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import TagFilter from "@/components/TagFilter";
import PromptCard from "@/components/PromptCard";
import EmptyState from "@/components/EmptyState";
import PromptForm from "@/components/PromptForm";
import AIAssistant from "@/components/AIAssistant";
import { Prompt, Tag } from "@/types";
import { getPrompts, savePrompt, deletePrompt, getAllTags } from "@/lib/promptStore";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load prompts and tags from localStorage
    const loadedPrompts = getPrompts();
    setPrompts(loadedPrompts);
    
    const loadedTags = getAllTags();
    setAllTags(loadedTags);
  }, []);

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleSavePrompt = (promptData: Prompt) => {
    // Ensure promptData has all required fields
    const completePromptData: Prompt = {
      id: promptData.id || Date.now().toString(),
      text: promptData.text,
      tags: promptData.tags || [],
      type: promptData.type || "task",
      createdAt: promptData.createdAt || new Date().toISOString(),
    };
    
    // Save to localStorage
    savePrompt(completePromptData);
    
    // Update state
    const updatedPrompts = editingPrompt?.id 
      ? prompts.map(p => p.id === completePromptData.id ? completePromptData : p)
      : [completePromptData, ...prompts];
    
    setPrompts(updatedPrompts);
    
    // Update all tags
    const updatedTags = getAllTags();
    setAllTags(updatedTags);
    
    console.log("Prompt saved:", completePromptData);
    console.log("Updated prompts:", updatedPrompts);
  };

  const handleDeletePrompt = (id: string) => {
    // Delete from localStorage
    deletePrompt(id);
    
    // Update state
    const updatedPrompts = prompts.filter(p => p.id !== id);
    setPrompts(updatedPrompts);
    
    // Update all tags
    const updatedTags = getAllTags();
    setAllTags(updatedTags);
    
    toast({
      title: "Prompt deleted",
      description: "Your prompt has been successfully deleted",
    });
  };

  const handleToggleTag = (tagId: string) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tagId) 
        ? prevTags.filter(id => id !== tagId)
        : [...prevTags, tagId]
    );
  };
  
  const handleUseAIPrompt = (text: string) => {
    // Create a new prompt with the AI-generated text
    // Generate a temporary ID for the new prompt
    const tempPrompt: Prompt = {
      id: "", // Empty ID because it's not saved yet
      text: text,
      tags: [], // Start with empty tags array
      type: "task", // Default to task type
      createdAt: ""
    };
    
    // Open the form with the AI text already populated
    setEditingPrompt(tempPrompt);
    setIsFormOpen(true);
    console.log("Using AI prompt:", tempPrompt);
  };

  const filteredPrompts = prompts.filter(prompt => {
    // Filter by search term
    const matchesSearch = searchTerm 
      ? prompt.text.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    
    // Filter by selected tags
    const matchesTags = selectedTags.length > 0 
      ? selectedTags.every(tagId => prompt.tags.some(tag => tag.id === tagId))
      : true;
    
    return matchesSearch && matchesTags;
  });

  const isFiltered = searchTerm !== "" || selectedTags.length > 0;

  return (
    <div className="container mx-auto py-8 px-4 min-h-screen max-w-5xl">
      <Header onAddPrompt={handleAddPrompt} />
      
      <div className="mb-8 space-y-6">
        <SearchInput searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <TagFilter 
          allTags={allTags} 
          selectedTags={selectedTags} 
          onToggleTag={handleToggleTag} 
        />
      </div>
      
      {filteredPrompts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onEdit={handleEditPrompt}
              onDelete={handleDeletePrompt}
            />
          ))}
        </div>
      ) : (
        <EmptyState onAddPrompt={handleAddPrompt} isFiltered={isFiltered} />
      )}
      
      <PromptForm
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSave={handleSavePrompt}
        editingPrompt={editingPrompt}
      />
      
      <AIAssistant onUsePrompt={handleUseAIPrompt} />
    </div>
  );
};

export default Index;
