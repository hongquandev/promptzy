import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagInput from "./TagInput";
import { Prompt, Tag } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  editingPrompt: Prompt | null;
}

const PromptForm = ({ isOpen, onClose, onSave, editingPrompt }: PromptFormProps) => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [type, setType] = useState<"system" | "task" | "image" | "video">("task");
  const { toast } = useToast();

  useEffect(() => {
    if (editingPrompt) {
      setText(editingPrompt.text);
      // Only copy tags if the prompt has an id (meaning it's not a new AI-generated prompt)
      setTags(editingPrompt.tags ? [...editingPrompt.tags] : []);
      // Set type if it exists, otherwise default to task
      setType(editingPrompt.type || "task");
    } else {
      setText("");
      setTags([]);
      setType("task");
    }
  }, [editingPrompt, isOpen]);

  const handleAddTag = (tag: Tag) => {
    // Check if tag already exists
    if (!tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase())) {
      setTags([...tags, tag]);
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setTags(tags.filter(tag => tag.id !== tagId));
  };

  const handleSubmit = () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Prompt text cannot be empty",
        variant: "destructive",
      });
      return;
    }

    // Make sure we have a valid prompt object with all required fields
    const promptData: Prompt = {
      // Generate a UUID for new prompts to satisfy Supabase UUID requirements
      id: editingPrompt?.id && editingPrompt.id !== "" ? editingPrompt.id : crypto.randomUUID(),
      text: text.trim(),
      tags: tags || [], // Ensure tags is an array (even if empty)
      type: type,
      createdAt: editingPrompt?.createdAt && editingPrompt.id !== "" ? editingPrompt.createdAt : new Date().toISOString(),
    };

    // Debug log to see what's being saved
    console.log("Saving prompt:", promptData);
    
    onSave(promptData);
    toast({
      title: editingPrompt?.id ? "Prompt updated" : "Prompt added",
      description: editingPrompt?.id 
        ? "Your prompt has been successfully updated" 
        : "Your prompt has been successfully added",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {editingPrompt?.id ? "Edit Prompt" : "Add New Prompt"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label>Prompt Type</Label>
            <RadioGroup 
              value={type} 
              onValueChange={(value) => setType(value as "system" | "task" | "image" | "video")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="prompt-system" />
                <Label htmlFor="prompt-system">System Prompt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="task" id="prompt-task" />
                <Label htmlFor="prompt-task">Task Prompt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="image" id="prompt-image" />
                <Label htmlFor="prompt-image">Image Prompt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="video" id="prompt-video" />
                <Label htmlFor="prompt-video">Video Prompt</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="prompt">Prompt Text</Label>
            <Textarea
              id="prompt"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your prompt text here..."
              className="min-h-[150px] bg-secondary/50 border-secondary"
            />
          </div>
          <div className="space-y-2">
            <Label>Tags</Label>
            <TagInput
              tags={tags}
              onAddTag={handleAddTag}
              onRemoveTag={handleRemoveTag}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="bg-purple-500 hover:bg-purple-700"
          >
            {editingPrompt?.id ? "Update Prompt" : "Save Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptForm;
