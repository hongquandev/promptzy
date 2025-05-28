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
    <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Logo" className="w-10 h-10 sm:w-12 sm:h-12" />
        <h1 className="text-2xl sm:text-3xl font-bold">Promptzy</h1>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center gap-1 flex-1 sm:flex-none"
        >
          <Settings className="h-4 w-4" />
          <span className="hidden xs:inline">Settings</span>
        </Button>
        <Button
          onClick={onAddPrompt}
          className="bg-purple-600 hover:bg-purple-700 flex items-center gap-1 flex-1 sm:flex-none"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden xs:inline">Add Prompt</span>
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
