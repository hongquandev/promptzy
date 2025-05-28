
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onAddPrompt: () => void;
  isFiltered: boolean;
}

const EmptyState = ({ onAddPrompt, isFiltered }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 border border-dashed border-secondary rounded-xl text-center animate-fade-in">
      <div className="bg-secondary/50 p-4 rounded-full mb-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-purple-300"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </div>

      <h3 className="text-xl font-semibold mb-2">
        {isFiltered ? "No matching prompts found" : "No prompts yet"}
      </h3>

      <p className="text-muted-foreground mb-6 max-w-sm">
        {isFiltered
          ? "Try changing your search term or removing some tag filters."
          : "Start by adding your first AI prompt to organize them all in one place."}
      </p>

      {!isFiltered && (
        <Button onClick={onAddPrompt} className="bg-purple-600 hover:bg-purple-700">
          <Plus className="mr-2 h-4 w-4" />
          Add your first prompt
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
