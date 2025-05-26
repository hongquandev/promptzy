import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";

interface HeaderProps {
  onAddPrompt: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPrompt }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold">AI Prompt Dashboard</h1>
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1"
        >
          <Settings className="h-4 w-4" />
          Settings
        </Button>
        <Button
          onClick={onAddPrompt}
          className="bg-purple-500 hover:bg-purple-700 flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add Prompt
        </Button>
      </div>

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </header>
  );
};

export default Header;
