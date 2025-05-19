
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Settings, Database } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  storageType: "local" | "supabase" | "both";
  onStorageTypeChange: (type: "local" | "supabase" | "both") => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  storageType,
  onStorageTypeChange
}) => {
  const [selectedStorage, setSelectedStorage] = useState<"local" | "supabase" | "both">(storageType);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const { toast } = useToast();

  // Check if user is logged in to Supabase
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

  const handleSave = async () => {
    // If user selected Supabase or both but is not logged in
    if ((selectedStorage === "supabase" || selectedStorage === "both") && !isLoggedIn) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to use Supabase storage. Storage type set to local only.",
        variant: "destructive"
      });
      onStorageTypeChange("local");
    } else {
      onStorageTypeChange(selectedStorage);
      toast({
        title: "Settings Saved",
        description: `Storage type set to ${selectedStorage}.`
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Dashboard Settings
          </DialogTitle>
          <DialogDescription>
            Configure how you want to store and access your prompts.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-3">Storage Options</h3>
              <RadioGroup 
                value={selectedStorage} 
                onValueChange={(value) => setSelectedStorage(value as "local" | "supabase" | "both")}
              >
                <div className="flex items-start space-x-2 mb-3">
                  <RadioGroupItem value="local" id="local" />
                  <div className="grid gap-1.5">
                    <Label htmlFor="local" className="font-medium">Local Storage Only</Label>
                    <p className="text-sm text-muted-foreground">
                      Store prompts in your browser. They won't be available on other devices.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2 mb-3">
                  <RadioGroupItem 
                    value="supabase" 
                    id="supabase" 
                    disabled={!isLoggedIn}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="supabase" className="font-medium">
                      Supabase Only
                      {!isLoggedIn && <span className="ml-2 text-xs text-yellow-500">(Login required)</span>}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Store prompts in the cloud. Access from any device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-2">
                  <RadioGroupItem 
                    value="both" 
                    id="both" 
                    disabled={!isLoggedIn}
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="both" className="font-medium">
                      Both (Synchronized)
                      {!isLoggedIn && <span className="ml-2 text-xs text-yellow-500">(Login required)</span>}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Store prompts locally and in the cloud. Best for offline access with sync.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {!isLoggedIn && (selectedStorage === "supabase" || selectedStorage === "both") && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-md">
                <p className="text-sm text-yellow-200">
                  You need to sign in to use Supabase storage. Please sign in first or select Local Storage.
                </p>
              </div>
            )}
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-purple-500 hover:bg-purple-700">
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
