
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface HeaderProps {
  onAddPrompt: () => void;
}

const Header = ({ onAddPrompt }: HeaderProps) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
          AI Prompt Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage and organize your AI prompts
        </p>
      </div>
      <Button 
        onClick={onAddPrompt} 
        className="bg-purple-500 hover:bg-purple-700 text-white"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Prompt
      </Button>
    </header>
  );
};

export default Header;
