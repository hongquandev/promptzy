
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import TagInput from "./TagInput";
import { Prompt, Tag } from "@/types";
import { useToast } from "@/hooks/use-toast";

interface PromptFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prompt: Prompt) => void;
  editingPrompt: Prompt | null;
}

const PromptForm = ({ isOpen, onClose, onSave, editingPrompt }: PromptFormProps) => {
  const [text, setText] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (editingPrompt) {
      setText(editingPrompt.text);
      setTags([...editingPrompt.tags]);
    } else {
      setText("");
      setTags([]);
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

    const promptData: Prompt = {
      id: editingPrompt?.id || Date.now().toString(),
      text: text.trim(),
      tags,
      createdAt: editingPrompt?.createdAt || new Date().toISOString(),
    };

    onSave(promptData);
    toast({
      title: editingPrompt ? "Prompt updated" : "Prompt added",
      description: editingPrompt 
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
            {editingPrompt ? "Edit Prompt" : "Add New Prompt"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
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
            {editingPrompt ? "Update Prompt" : "Save Prompt"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptForm;
