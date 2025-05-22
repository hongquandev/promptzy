import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings, CloudUpload } from "lucide-react";
import SettingsDialog from "@/components/SettingsDialog";
import { getPrompts } from "@/lib/promptStore";
import { syncPromptsToSupabase, testSupabaseConnection } from "@/lib/supabasePromptStore";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  onAddPrompt: () => void;
  storageType: "local" | "supabase" | "both";
  onStorageTypeChange: (type: "local" | "supabase" | "both") => void;
}

const Header: React.FC<HeaderProps> = ({ onAddPrompt, storageType, onStorageTypeChange }) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  const forceSync = async () => {
    if (storageType === "local") {
      toast({
        title: "Sync not available",
        description: "Change storage type to 'Supabase' or 'Both' in settings first",
        variant: "destructive"
      });
      return;
    }

    setIsSyncing(true);
    try {
      // Test connection first
      const isConnected = await testSupabaseConnection();
      if (!isConnected) {
        toast({
          title: "Supabase Connection Failed",
          description: "Could not connect to Supabase. Check your settings.",
          variant: "destructive"
        });
        setIsSyncing(false);
        return;
      }

      // Get all local prompts
      const localPrompts = getPrompts();
      
      if (localPrompts.length === 0) {
        toast({
          title: "No local prompts found",
          description: "There are no prompts to sync from local storage",
        });
        setIsSyncing(false);
        return;
      }

      // Sync them to Supabase
      toast({
        title: "Syncing Prompts",
        description: `Syncing ${localPrompts.length} prompts to Supabase...`,
      });
      
      await syncPromptsToSupabase(localPrompts);
      
      toast({
        title: "Sync Complete",
        description: `${localPrompts.length} prompts synced to Supabase.`,
      });
    } catch (error) {
      console.error("Error during sync:", error);
      toast({
        title: "Sync Failed",
        description: "An error occurred during synchronization",
        variant: "destructive"
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <img src="/favicon.png" alt="Logo" className="w-8 h-8" />
        <h1 className="text-2xl font-bold">AI Prompt Dashboard</h1>
      </div>
      <div className="flex gap-2">
        {(storageType === "both" || storageType === "supabase") && (
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={forceSync}
            disabled={isSyncing}
            className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 hover:bg-blue-200 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-700"
          >
            <CloudUpload className="h-4 w-4" />
            {isSyncing ? "Syncing..." : "Sync to Cloud"}
          </Button>
        )}
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
        storageType={storageType}
        onStorageTypeChange={onStorageTypeChange}
      />
    </header>
  );
};

export default Header;
