import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"; 
import { Checkbox } from "@/components/ui/checkbox";
import { Settings, Database, CheckCircle, AlertCircle, Sparkles, RefreshCw, Code, Database as DatabaseIcon, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { testSupabaseConnection, checkTableExists, CREATE_TABLE_SQL } from "@/lib/supabasePromptStore";
import { saveSystemPrompt, useDefaultPrompt, isUsingDefaultPrompt } from "@/lib/systemPromptStore";
import { SYSTEM_PROMPT_DEFAULT } from "@/components/AIAssistant";
import { createSupabaseClient, getSupabaseCredentials } from "@/integrations/supabase/client";

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
  // Pre-load default Supabase credentials to allow saving settings without re-entry
  const { supabaseUrl: defaultSupabaseUrl, supabaseKey: defaultSupabaseKey } = getSupabaseCredentials();
  const [selectedStorage, setSelectedStorage] = useState<"local" | "supabase" | "both">(storageType);
  const [supabaseUrl, setSupabaseUrl] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-url') || defaultSupabaseUrl;
  });
  const [supabaseKey, setSupabaseKey] = useState<string>(() => {
    return localStorage.getItem('custom-supabase-key') || defaultSupabaseKey;
  });
  const [isConnectionTesting, setIsConnectionTesting] = useState<boolean>(false);
  const [connectionStatus, setConnectionStatus] = useState<"untested" | "success" | "failed">("untested");
  const [tableStatus, setTableStatus] = useState<"exists" | "missing" | "unknown">("unknown");
  const [showSqlSetup, setShowSqlSetup] = useState<boolean>(false);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(() => {
    return localStorage.getItem('ai-system-prompt') || SYSTEM_PROMPT_DEFAULT;
  });
  const [useDefaultSystemPrompt, setUseDefaultSystemPrompt] = useState<boolean>(() => {
    return isUsingDefaultPrompt();
  });
  const { toast } = useToast();

  const extractProjectId = (url: string): string => {
    // Extract the project ID from the Supabase URL
    // Example: https://abcdefghijklmn.supabase.co -> abcdefghijklmn
    const match = url.match(/https?:\/\/([a-z0-9-]+)\.supabase\.co/);
    return match ? match[1] : "";
  };

  const getSupabaseSqlEditorUrl = (): string => {
    const projectId = extractProjectId(supabaseUrl);
    if (!projectId) return "https://app.supabase.com/";
    return `https://app.supabase.com/project/${projectId}/sql/new`;
  };

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
    setTableStatus("unknown");
    setShowSqlSetup(false);

    // Temporarily store the credentials to test the connection
    localStorage.setItem('custom-supabase-url', supabaseUrl);
    localStorage.setItem('custom-supabase-key', supabaseKey);

    // Test basic connection
    const isConnected = await testSupabaseConnection();
    
    if (!isConnected) {
      setIsConnectionTesting(false);
      setConnectionStatus("failed");
      toast({
        title: "Connection Failed",
        description: "Could not connect to Supabase. Please check your credentials and try again.",
        variant: "destructive"
      });
      return;
    }

    // Check if table exists
    const client = createSupabaseClient();
    const tableExists = await checkTableExists(client);

    if (tableExists) {
      setTableStatus("exists");
      setConnectionStatus("success");
      setIsConnectionTesting(false);
      toast({
        title: "Connection Successful",
        description: "Successfully connected to your Supabase instance with table access.",
      });
      return;
    }

    // Table doesn't exist, show SQL setup guidance
    setTableStatus("missing");
    setConnectionStatus("failed");
    setShowSqlSetup(true);
    toast({
      title: "Table Setup Required",
      description: "Connected to Supabase, but the prompts table doesn't exist. Please create it manually.",
      variant: "destructive"
    });
    
    setIsConnectionTesting(false);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(CREATE_TABLE_SQL.trim());
    toast({
      title: "SQL Copied",
      description: "Table creation SQL copied to clipboard."
    });
  };

  const openSupabaseSqlEditor = () => {
    window.open(getSupabaseSqlEditorUrl(), '_blank');
  };

  const handleResetSystemPrompt = () => {
    setCustomSystemPrompt(SYSTEM_PROMPT_DEFAULT);
    toast({
      title: "System Prompt Reset",
      description: "The system prompt has been reset to default."
    });
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

        // Check if table exists
        const client = createSupabaseClient();
        const tableExists = await checkTableExists(client);
        
        if (!tableExists) {
          toast({
            title: "Supabase Table Required",
            description: "Please create the prompts table in your Supabase instance before saving.",
            variant: "destructive"
          });
          setShowSqlSetup(true);
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
    
    // Save system prompt settings
    if (useDefaultSystemPrompt) {
      useDefaultPrompt(true);
    } else {
      useDefaultPrompt(false);
      saveSystemPrompt(customSystemPrompt);
    }
    
    // Save the storage type directly to localStorage in addition to the state change
    // This ensures it persists immediately even if there's an issue with the effect in Index.tsx
    localStorage.setItem('ai-prompts-storage-type', JSON.stringify(selectedStorage));
    console.log("Saved storage type in settings dialog:", selectedStorage);
    
    // Call the parent component's handler to update the state
    onStorageTypeChange(selectedStorage);
    
    toast({
      title: "Settings Saved",
      description: `Your settings have been updated.`
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
          <div className="space-y-6">
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
                <div className="flex items-center gap-2">
                  <DatabaseIcon className="h-4 w-4 text-blue-500" />
                  <h3 className="text-sm font-medium">Supabase Configuration</h3>
                </div>
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

                {showSqlSetup && (
                  <div className="mt-4 p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-md">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-amber-800 dark:text-amber-300">Table Setup Required</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                          You need to create the 'prompts' table in your Supabase SQL editor:
                        </p>
                      </div>
                    </div>
                    
                    <div className="relative mt-2">
                      <pre className="text-xs p-2 bg-gray-800 text-gray-100 rounded-md overflow-x-auto">{CREATE_TABLE_SQL.trim()}</pre>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute top-1 right-1 h-6 w-6 p-0"
                        onClick={handleCopySql}
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                    
                    <div className="mt-3 flex flex-col gap-2">
                      <p className="text-xs text-amber-700 dark:text-amber-400">
                        Steps to create the table:
                      </p>
                      <ol className="text-xs text-amber-700 dark:text-amber-400 list-decimal pl-4 space-y-1">
                        <li>Go to your Supabase dashboard</li>
                        <li>Select your project</li> 
                        <li>Navigate to SQL Editor</li>
                        <li>Create a new query</li>
                        <li>Paste the SQL code above</li>
                        <li>Click "Run" to execute</li>
                      </ol>
                      
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-2 h-8 text-xs flex items-center gap-1 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300 bg-amber-100 dark:bg-amber-900 hover:bg-amber-200 dark:hover:bg-amber-800 w-full justify-center"
                        onClick={openSupabaseSqlEditor}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Open Supabase SQL Editor
                      </Button>
                    </div>
                  </div>
                )}
                
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

            <div className="space-y-4 border border-border p-4 rounded-md">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-purple-500" />
                <h3 className="text-sm font-medium">AI Assistant Configuration</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Customize the system prompt used by the AI Assistant to generate prompts
              </p>

              <div className="flex items-center space-x-2 mb-2">
                <Checkbox 
                  id="use-default-prompt" 
                  checked={useDefaultSystemPrompt}
                  onCheckedChange={(checked) => {
                    setUseDefaultSystemPrompt(checked as boolean);
                  }}
                />
                <Label htmlFor="use-default-prompt" className="text-sm">
                  Use default system prompt
                </Label>
              </div>

              <div className={useDefaultSystemPrompt ? "opacity-50" : ""}>
                <div className="flex justify-between mb-2">
                  <Label htmlFor="system-prompt" className="text-sm">
                    System Prompt
                  </Label>
                  <Button 
                    variant="ghost"
                    size="sm"
                    onClick={handleResetSystemPrompt}
                    className="h-6 text-xs flex items-center gap-1 text-muted-foreground"
                  >
                    <RefreshCw className="h-3 w-3" />
                    Reset to default
                  </Button>
                </div>
                <Textarea
                  id="system-prompt"
                  value={customSystemPrompt}
                  onChange={(e) => setCustomSystemPrompt(e.target.value)}
                  className="min-h-[120px] resize-y"
                  placeholder="Enter a system prompt for the AI Assistant"
                  disabled={useDefaultSystemPrompt}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This prompt defines how the AI Assistant generates prompts based on your requests.
                </p>
              </div>
            </div>
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
