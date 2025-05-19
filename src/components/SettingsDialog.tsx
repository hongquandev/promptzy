
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
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
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-url') || "";
  });
  const [supabaseKey, setSupabaseKey] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-key') || "";
  });
  const [showCustomFields, setShowCustomFields] = useState<boolean>(false);
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

  // Check if custom Supabase details exist
  useEffect(() => {
    const hasCustomConfig = localStorage.getItem('custom-supabase-url') && 
                           localStorage.getItem('custom-supabase-key');
    setShowCustomFields(true); // Always show custom fields
  }, []);

  const handleSave = async () => {
    // Check if custom Supabase config is provided
    if ((selectedStorage === "supabase" || selectedStorage === "both")) {
      if (supabaseUrl && supabaseKey) {
        // Save custom Supabase config to local storage
        localStorage.setItem('custom-supabase-url', supabaseUrl);
        localStorage.setItem('custom-supabase-key', supabaseKey);
        
        toast({
          title: "Settings Saved",
          description: "Custom Supabase configuration has been saved. Please refresh the page to apply changes."
        });
      } else if (!isLoggedIn) {
        toast({
          title: "Supabase Configuration Required",
          description: "Please enter your Supabase URL and API Key or choose Local Storage only.",
          variant: "destructive"
        });
        return;
      }
    }
    
    onStorageTypeChange(selectedStorage);
    toast({
      title: "Settings Saved",
      description: `Storage type set to ${selectedStorage}.`
    });
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
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="supabase" className="font-medium">
                      Supabase Only
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
                  />
                  <div className="grid gap-1.5">
                    <Label htmlFor="both" className="font-medium">
                      Both (Synchronized)
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Store prompts locally and in the cloud. Best for offline access with sync.
                    </p>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {(selectedStorage === "supabase" || selectedStorage === "both") && (
              <div className="space-y-4 border border-border p-4 rounded-md">
                <h3 className="text-sm font-medium">Custom Supabase Configuration</h3>
                <p className="text-xs text-muted-foreground">
                  Enter your Supabase project URL and anon key to connect to your own Supabase instance
                </p>
                
                <div className="space-y-2">
                  <div className="space-y-1">
                    <Label htmlFor="supabase-url">Supabase Project URL</Label>
                    <Input
                      id="supabase-url"
                      placeholder="https://your-project.supabase.co"
                      value={supabaseUrl}
                      onChange={(e) => setSupabaseUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="supabase-key">Supabase Anon Key</Label>
                    <Input
                      id="supabase-key"
                      type="password"
                      placeholder="your-anon-key"
                      value={supabaseKey}
                      onChange={(e) => setSupabaseKey(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2">To find your Supabase details:</p>
                  <ol className="list-decimal pl-4 space-y-1">
                    <li>Go to your Supabase project dashboard</li>
                    <li>Navigate to Project Settings → API</li>
                    <li>Copy the "Project URL" and "anon" public API key</li>
                  </ol>
                </div>
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
