import { useState } from "react";
import { Prompt } from "@/types";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Edit, Trash } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface PromptCardProps {
  prompt: Prompt;
  onEdit: (prompt: Prompt) => void;
  onDelete: (id: string) => void;
}

export default function PromptCard({ prompt, onEdit, onDelete }: PromptCardProps) {
  const [expanded, setExpanded] = useState(false);
  
  // Ensure we always have a type value
  const promptType = prompt.type || "task";

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(prompt);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(prompt.id);
  };

  // Get the first line for preview
  const firstLine = prompt.title ?? prompt.text.split('\n')[0];
  const previewText = firstLine.length > 320 ? firstLine.substring(0, 320) + "..." : firstLine;

  // Determine the prompt type display badge color
  const typeColor = promptType === "system"
    ? "bg-blue-600/20 text-blue-400 border-blue-800/50"
    : promptType === "task"
      ? "bg-amber-600/20 text-amber-400 border-amber-800/50"
      : promptType === "image"
        ? "bg-green-600/20 text-green-400 border-green-800/50"
        : "bg-purple-600/20 text-purple-400 border-purple-800/50";
    
  return (
    <div className="prompt-card rounded-xl overflow-hidden shadow-md animate-fade-in">
      <div className="p-4 flex flex-col gap-2 btn-hover-effect">
        {/* Add prompt type badge - always visible */}
        <div className="flex items-center gap-2">
          <div className={`px-2 py-0.5 text-xs font-medium rounded border ${typeColor}`}>
            {promptType === "system"
              ? "SYSTEM"
              : promptType === "task"
                ? "TASK"
                : promptType === "image"
                  ? "IMAGE"
                  : "VIDEO"}
          </div>
        </div>
        
        <div className="flex justify-between items-start">
          {/* Make the text area clickable for expansion */}
          <div 
            className="flex-1 overflow-hidden text-sm cursor-pointer" 
            onClick={toggleExpanded}
          >
            <div className="text-muted-foreground text-xs">
              {formatDistanceToNow(new Date(prompt.createdAt), { addSuffix: true })}
            </div>
            <div className="font-medium mt-1 line-clamp-1">
              {previewText}
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-2">
            {/* Edit button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-secondary"
              onClick={handleEdit}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            {/* Delete button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-destructive/20"
              onClick={handleDelete}
            >
              <Trash className="h-4 w-4" />
            </Button>
            
            {/* Toggle button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-white hover:bg-secondary"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded();
              }}
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-1">
            {prompt.tags.map((tag) => (
              <span key={tag.id} className="tag">
                {tag.name}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {expanded && (
        <div className="p-4 pt-0 border-t border-border/30 mt-2 animate-accordion-down">
          <div className="bg-black/20 p-3 rounded-lg whitespace-pre-wrap text-sm">
            {prompt.text}
          </div>
        </div>
      )}
    </div>
  );
}
