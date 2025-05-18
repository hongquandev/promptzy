
import { useState, useRef } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { AIResponse } from "@/types";
import { Bot, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AIAssistantProps {
  onUsePrompt: (text: string) => void;
}

const AIAssistant = ({ onUsePrompt }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState<AIResponse>({
    text: "",
    loading: false,
    error: null
  });
  const { toast } = useToast();
  const responseRef = useRef<HTMLDivElement>(null);

  const handleGeneratePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    setResponse({
      text: "",
      loading: true,
      error: null
    });

    try {
      const encodedPrompt = encodeURIComponent(prompt);
      const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai&private=true`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const text = await response.text();
      
      setResponse({
        text,
        loading: false,
        error: null
      });
    } catch (error) {
      setResponse({
        text: "",
        loading: false,
        error: error instanceof Error ? error.message : "Failed to generate content"
      });
      
      toast({
        title: "Error",
        description: "Failed to generate content. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleCopyResponse = () => {
    if (response.text) {
      navigator.clipboard.writeText(response.text);
      toast({
        title: "Copied",
        description: "Response copied to clipboard"
      });
    }
  };

  const handleUsePrompt = () => {
    if (response.text) {
      onUsePrompt(response.text);
      toast({
        title: "Success",
        description: "AI response added as a new prompt"
      });
      setIsOpen(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-full max-w-md">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-secondary/90 backdrop-blur-sm rounded-lg shadow-lg border border-purple-500/20"
      >
        <CollapsibleTrigger asChild>
          <Button 
            className="w-full flex items-center justify-between p-4 rounded-lg bg-purple-600 hover:bg-purple-700 transition-all duration-200"
          >
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span>AI Prompt Assistant</span>
            </div>
            {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 space-y-4">
          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-muted-foreground">
              What kind of prompt would you like to create?
            </label>
            <Textarea
              id="prompt"
              placeholder="E.g., Create a prompt for a fantasy story about dragons"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-[80px] bg-secondary/50 border-secondary"
            />
          </div>
          
          <Button 
            onClick={handleGeneratePrompt}
            disabled={response.loading || !prompt.trim()}
            className="w-full bg-purple-500 hover:bg-purple-700"
          >
            {response.loading ? "Generating..." : "Generate Prompt"}
          </Button>
          
          {response.text && (
            <div className="space-y-3">
              <div 
                ref={responseRef}
                className="bg-secondary p-3 rounded-md max-h-[200px] overflow-y-auto whitespace-pre-wrap text-sm"
              >
                {response.text}
              </div>
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopyResponse}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button 
                  size="sm" 
                  className="flex-1 bg-purple-500 hover:bg-purple-700"
                  onClick={handleUsePrompt}
                >
                  Use as Prompt
                </Button>
              </div>
            </div>
          )}
          
          {response.error && (
            <div className="p-3 bg-destructive/20 border border-destructive/40 rounded-md text-sm text-destructive">
              {response.error}
            </div>
          )}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};

export default AIAssistant;
