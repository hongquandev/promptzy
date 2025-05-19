import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import SettingsDialog from './SettingsDialog';

interface HeaderProps {
  onAddPrompt: () => void;
  storageType: "local" | "supabase" | "both";
  onStorageTypeChange: (type: "local" | "supabase" | "both") => void;
}

const Header = ({ onAddPrompt, storageType, onStorageTypeChange }: HeaderProps) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
          <img src="/icon.png" alt="Dashboard Icon" className="inline-block h-8 w-8 mr-2 align-middle" />
          AI Prompt Dashboard
        </h1>
        <p className="text-muted-foreground text-sm">
          Manage and organize your AI prompts
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSettingsOpen(true)}
          className="text-muted-foreground hover:text-foreground"
          title="Settings"
        >
          <Settings className="h-4 w-4" />
        </Button>
        <Button 
          onClick={onAddPrompt} 
          className="bg-purple-500 hover:bg-purple-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Prompt
        </Button>
      </div>

      <SettingsDialog 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        storageType={storageType}
        onStorageTypeChange={onStorageTypeChange}
      />
    </header>
  );
};

export default Header;
