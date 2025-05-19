import { useState, useRef, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { AIResponse, AIGenerateOptions } from "@/types";
import { Bot, ChevronDown, ChevronUp, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getSystemPrompt } from "@/lib/systemPromptStore";

interface AIAssistantProps {
  onUsePrompt: (text: string) => void;
}

// Export the default system prompt so it can be used elsewhere
export const SYSTEM_PROMPT_DEFAULT = `You are a helpful AI prompt generator. Your task is to create clear, effective prompts based on the user's request.

For SYSTEM prompts: Create concise instructions that define the AI's role, personality, constraints, and knowledge. These should guide the AI's overall behavior without asking it to perform specific tasks.

For TASK prompts: Create specific instructions that request the AI to complete a particular task, answer a question, or provide information on a topic.

Make all prompts clear, specific, and well-structured. Avoid ambiguity and provide sufficient context.`;

const AIAssistant = ({ onUsePrompt }: AIAssistantProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [promptType, setPromptType] = useState<"system" | "task">("task");
  const [response, setResponse] = useState<AIResponse>({
    text: "",
    loading: false,
    error: null
  });
  const [systemPrompt, setSystemPrompt] = useState<string>(SYSTEM_PROMPT_DEFAULT);
  const { toast } = useToast();
  const responseRef = useRef<HTMLDivElement>(null);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Load system prompt from storage when component mounts
  useEffect(() => {
    setSystemPrompt(getSystemPrompt());
  }, []);

  const handleGeneratePrompt = async () => {
    if (!prompt.trim()) {
      toast({
        title: "Error",
        description: "Please enter a prompt to generate content",
        variant: "destructive",
      });
      return;
    }

    // Clean up any existing event source
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    setResponse({
      text: "",
      loading: true,
      error: null
    });

    try {
      let userPrompt = '';
      
      if (promptType === "system") {
        userPrompt = `Generate a SYSTEM PROMPT for: ${prompt}. This should define an AI's role, personality, and constraints without asking it to perform specific tasks.`;
      } else {
        userPrompt = `Generate a TASK PROMPT for: ${prompt}. This should provide specific instructions for an AI to complete a particular task.`;
      }
      
      const encodedPrompt = encodeURIComponent(userPrompt);
      // Use the system prompt from state (which comes from storage) instead of the hardcoded one
      const encodedSystemPrompt = encodeURIComponent(systemPrompt);
      // Use stream=true for streaming, model=openai-large, and private=true
      const url = `https://text.pollinations.ai/${encodedPrompt}?model=openai-large&private=true&stream=true&system=${encodedSystemPrompt}`;
      
      // Create a new event source
      const eventSource = new EventSource(url);
      eventSourceRef.current = eventSource;
      let fullText = '';
      let hasReceivedContent = false;
      
      eventSource.onmessage = (event) => {
        try {
          // Only add the actual content, not the JSON metadata
          if (event.data.startsWith("{")) {
            const parsedData = JSON.parse(event.data);
            // Check for content in the delta if this is a streaming chunk
            if (parsedData.choices && parsedData.choices[0] && parsedData.choices[0].delta) {
              const content = parsedData.choices[0].delta.content;
              if (content) {
                fullText += content;
                hasReceivedContent = true;
                
                // Remove [DONE] marker from the text if present
                fullText = fullText.replace(/\[DONE\]/g, "");
                
                setResponse({
                  text: fullText,
                  loading: true,
                  error: null
                });
              }
            }
          } else {
            // If it's not JSON, it's probably just the content
            fullText += event.data;
            // Remove [DONE] marker from the text if present
            fullText = fullText.replace(/\[DONE\]/g, "");
            
            hasReceivedContent = true;
            setResponse({
              text: fullText,
              loading: true,
              error: null
            });
          }
        } catch (error) {
          // If we can't parse as JSON, just add the raw data
          fullText += event.data;
          // Remove [DONE] marker from the text if present
          fullText = fullText.replace(/\[DONE\]/g, "");
          
          hasReceivedContent = true;
          setResponse({
            text: fullText,
            loading: true,
            error: null
          });
        }
      };
      
      eventSource.onerror = (error) => {
        eventSource.close();
        eventSourceRef.current = null;
        
        // Only show error if we haven't received any content
        if (!hasReceivedContent || !fullText.trim()) {
          setResponse({
            text: fullText || "",
            loading: false,
            error: error instanceof Error ? error.message : "Failed to generate content"
          });
          
          toast({
            title: "Error",
            description: "Failed to generate content. Please try again.",
            variant: "destructive",
          });
        } else {
          // We received content before the error, so treat it as a success
          // Final cleanup of any [DONE] markers
          fullText = fullText.replace(/\[DONE\]/g, "");
          
          setResponse({
            text: fullText,
            loading: false,
            error: null
          });
        }
      };
      
      eventSource.addEventListener('done', () => {
        eventSource.close();
        eventSourceRef.current = null;
        
        // Final cleanup of any [DONE] markers
        fullText = fullText.replace(/\[DONE\]/g, "");
        
        setResponse({
          text: fullText,
          loading: false,
          error: null
        });
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

  // Cleanup event source when component unmounts
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
            <label htmlFor="promptType" className="text-sm font-medium text-muted-foreground">
              What type of prompt do you want to generate?
            </label>
            <RadioGroup 
              value={promptType} 
              onValueChange={(value) => setPromptType(value as "system" | "task")}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="system" id="system" />
                <Label htmlFor="system">System Prompt</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="task" id="task" />
                <Label htmlFor="task">Task Prompt</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <label htmlFor="prompt" className="text-sm font-medium text-muted-foreground">
              {promptType === "system" 
                ? "Describe the AI assistant's role and personality" 
                : "What kind of task prompt would you like to create?"}
            </label>
            <Textarea
              id="prompt"
              placeholder={promptType === "system" 
                ? "E.g., A friendly customer service assistant that helps with product inquiries" 
                : "E.g., Create a prompt for writing a persuasive email"
              }
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
                  variant="outline" 
                  className="flex-1"
                  onClick={handleCopyResponse}
                >
                  <Copy className="mr-2 h-4 w-4" /> Copy
                </Button>
                <Button 
                  className="flex-1 bg-purple-500 hover:bg-purple-700"
                  onClick={handleUsePrompt}
                >
                  Use as Prompt
                </Button>
              </div>
            </div>
          )}
          
          {/* Only show the error message if there is an error AND no valid response text */}
          {response.error && !response.text && (
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
