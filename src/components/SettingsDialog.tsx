
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Settings, Database, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { testSupabaseConnection } from "@/lib/supabasePromptStore";

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
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-url') || "";
  });
  const [supabaseKey, setSupabaseKey] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-key') || "";
  });
  const [isConnectionTesting, setIsConnectionTesting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "failed">("untested");
  const { toast } = useToast();

  const handleTestConnection = async () => {
    if (!supabaseUrl || !supabaseKey) {
      toast({
        title: "Missing Information",
        description: "Please enter both Supabase URL and API Key",
        variant: "destructive"
      });
      return;
    }

    setIsConnectionTesting(true);
    setConnectionStatus("untested");

    // Temporarily store the credentials to test the connection
    localStorage.setItem('custom-supabase-url', supabaseUrl);
    localStorage.setItem('custom-supabase-key', supabaseKey);

    const isConnected = await testSupabaseConnection();
    
    setIsConnectionTesting(false);
    setConnectionStatus(isConnected ? "success" : "failed");
    
    if (isConnected) {
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your Supabase instance."
      });
    } else {
      toast({
        title: "Connection Failed",
        description: "Could not connect to Supabase. Please check your credentials and try again.",
        variant: "destructive"
      });
      // Remove temporarily stored credentials on failure
      if (!storageType.includes("supabase")) {
        localStorage.removeItem('custom-supabase-url');
        localStorage.removeItem('custom-supabase-key');
      }
    }
  };

  const handleSave = async () => {
    // Check if custom Supabase config is provided
    if ((selectedStorage === "supabase" || selectedStorage === "both")) {
      if (supabaseUrl && supabaseKey) {
        // Save custom Supabase config to local storage
        localStorage.setItem('custom-supabase-url', supabaseUrl);
        localStorage.setItem('custom-supabase-key', supabaseKey);
        
        // Test the connection before saving
        const isConnected = await testSupabaseConnection();
        if (!isConnected) {
          toast({
            title: "Supabase Connection Failed",
            description: "Could not connect to Supabase with the provided credentials. Please check your settings.",
            variant: "destructive"
          });
          return;
        }
        
        toast({
          title: "Settings Saved",
          description: "Custom Supabase configuration has been saved."
        });
      } else {
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
                
                <div className="flex justify-between items-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleTestConnection}
                    disabled={isConnectionTesting || !supabaseUrl || !supabaseKey}
                    className="flex gap-2 items-center"
                  >
                    {isConnectionTesting ? "Testing..." : "Test Connection"}
                  </Button>
                  
                  {connectionStatus === "success" && (
                    <div className="flex items-center text-sm text-green-600 gap-1">
                      <CheckCircle className="h-4 w-4" />
                      <span>Connected</span>
                    </div>
                  )}
                  
                  {connectionStatus === "failed" && (
                    <div className="flex items-center text-sm text-red-600 gap-1">
                      <AlertCircle className="h-4 w-4" />
                      <span>Failed</span>
                    </div>
                  )}
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
