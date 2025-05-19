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
import { getPromptsFromSupabase, savePromptToSupabase, deletePromptFromSupabase, syncPromptsToSupabase } from "@/lib/supabasePromptStore";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const STORAGE_TYPE_KEY = 'ai-prompts-storage-type';

const Index = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [allTags, setAllTags] = useState<Tag[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null);
  const [storageType, setStorageType] = useState<"local" | "supabase" | "both">(() => {
    const saved = localStorage.getItem(STORAGE_TYPE_KEY);
    return saved ? JSON.parse(saved) : "local";
  });
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();

  // Check Supabase auth status
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsLoggedIn(!!data.session);
    };
    
    checkAuth();
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session);
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load prompts based on storage type
  useEffect(() => {
    const loadPrompts = async () => {
      // Always check local storage
      const localPrompts = getPrompts();
      
      if (storageType === "local" || !isLoggedIn) {
        setPrompts(localPrompts);
        const localTags = getAllTags();
        setAllTags(localTags);
        return;
      }
      
      try {
        // For Supabase or both, fetch from Supabase
        const supabasePrompts = await getPromptsFromSupabase();
        
        if (storageType === "supabase") {
          setPrompts(supabasePrompts);
        } else if (storageType === "both") {
          // Merge local and Supabase prompts, preferring Supabase versions if IDs match
          const supabaseIds = new Set(supabasePrompts.map(p => p.id));
          const uniqueLocalPrompts = localPrompts.filter(p => !supabaseIds.has(p.id));
          const mergedPrompts = [...supabasePrompts, ...uniqueLocalPrompts];
          
          setPrompts(mergedPrompts);
          
          // Sync local prompts to Supabase if using "both" storage
          await syncPromptsToSupabase(uniqueLocalPrompts);
        }
      } catch (error) {
        console.error("Error loading prompts from Supabase:", error);
        // Fallback to local storage
        setPrompts(localPrompts);
        toast({
          title: "Error loading cloud data",
          description: "Falling back to local storage",
          variant: "destructive",
        });
      }
      
      // Update tags based on current prompts
      const loadedTags = getAllTags();
      setAllTags(loadedTags);
    };
    
    loadPrompts();
  }, [storageType, isLoggedIn, toast]);

  // Save storage type preference
  useEffect(() => {
    localStorage.setItem(STORAGE_TYPE_KEY, JSON.stringify(storageType));
  }, [storageType]);

  const handleAddPrompt = () => {
    setEditingPrompt(null);
    setIsFormOpen(true);
  };

  const handleEditPrompt = (prompt: Prompt) => {
    setEditingPrompt(prompt);
    setIsFormOpen(true);
  };

  const handleStorageTypeChange = (type: "local" | "supabase" | "both") => {
    setStorageType(type);
  };

  const handleSavePrompt = async (promptData: Prompt) => {
    // Ensure promptData has all required fields
    const completePromptData: Prompt = {
      id: promptData.id || Date.now().toString(),
      text: promptData.text,
      tags: promptData.tags || [],
      type: promptData.type || "task",
      createdAt: promptData.createdAt || new Date().toISOString(),
    };
    
    // Save based on storage type
    if (storageType === "local" || !isLoggedIn) {
      // Save to localStorage only
      savePrompt(completePromptData);
    } else {
      try {
        // Save to Supabase
        await savePromptToSupabase(completePromptData);
        
        // If "both", also save to local storage
        if (storageType === "both") {
          savePrompt(completePromptData);
        }
      } catch (error) {
        console.error("Error saving to Supabase:", error);
        toast({
          title: "Error saving to cloud",
          description: "Your prompt was saved locally instead",
          variant: "destructive",
        });
        // Fallback to local storage
        savePrompt(completePromptData);
      }
    }
    
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

  const handleDeletePrompt = async (id: string) => {
    // Delete based on storage type
    if (storageType === "local" || !isLoggedIn) {
      // Delete from localStorage only
      deletePrompt(id);
    } else {
      try {
        // Delete from Supabase
        await deletePromptFromSupabase(id);
        
        // If "both", also delete from local storage
        if (storageType === "both") {
          deletePrompt(id);
        }
      } catch (error) {
        console.error("Error deleting from Supabase:", error);
        toast({
          title: "Error deleting from cloud",
          description: "The prompt was only removed locally",
          variant: "destructive",
        });
        // Fallback to local storage deletion
        deletePrompt(id);
      }
    }
    
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
      <Header 
        onAddPrompt={handleAddPrompt} 
        storageType={storageType} 
        onStorageTypeChange={handleStorageTypeChange} 
      />
      
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
