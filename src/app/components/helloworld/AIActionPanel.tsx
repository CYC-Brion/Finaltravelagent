import { cn } from "../../../lib/utils";
import { Sparkles, Loader2, Send } from "lucide-react";
import { useState } from "react";

interface AIActionPanelProps {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  suggestions?: string[];
  className?: string;
}

export function AIActionPanel({
  onSubmit,
  isLoading = false,
  placeholder = "Ask AI to help with your trip...",
  suggestions = [
    "Suggest activities for families",
    "Find budget-friendly restaurants",
    "Add time for rest between activities",
  ],
  className,
}: AIActionPanelProps) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt("");
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      onSubmit(suggestion);
    }
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-purple-200 overflow-hidden",
        "bg-gradient-to-br from-white via-purple-50/30 to-pink-50/30",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-purple-200/50 bg-white/50">
        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="font-semibold text-sm text-purple-900">AI Assistant</h3>
      </div>

      {/* Input area */}
      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={placeholder}
              disabled={isLoading}
              rows={3}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border border-neutral-200",
                "bg-white text-neutral-900 placeholder:text-neutral-400",
                "focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent",
                "resize-none text-sm",
                isLoading && "opacity-50 cursor-not-allowed"
              )}
            />
            <button
              type="submit"
              disabled={!prompt.trim() || isLoading}
              className={cn(
                "absolute right-2 bottom-2 p-2 rounded-lg",
                "bg-gradient-to-br from-purple-500 to-pink-500",
                "text-white transition-all",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "hover:shadow-lg hover:scale-105 active:scale-95"
              )}
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Suggestions */}
          {!isLoading && suggestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-neutral-600">
                Try these suggestions:
              </p>
              <div className="flex flex-wrap gap-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 rounded-lg bg-white border border-purple-200 hover:border-purple-300 hover:bg-purple-50 text-xs text-purple-900 transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}
        </form>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="px-4 pb-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-50 border border-purple-200">
            <Loader2 className="w-4 h-4 text-purple-600 animate-spin" />
            <span className="text-sm text-purple-700">AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  );
}
