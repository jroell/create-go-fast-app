"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatComponent = getChatComponent;
function getChatComponent(config) {
    return `"use client";

import { useChat } from "ai/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Send, User, Bot } from "lucide-react";

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
  });

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <ScrollArea className="h-[400px] w-full rounded-md border p-4">
            {messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                Start a conversation with the AI assistant
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {message.role === 'user' ? (
                        <User className="h-6 w-6 text-blue-500" />
                      ) : (
                        <Bot className="h-6 w-6 text-green-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium mb-1">
                        {message.role === 'user' ? 'You' : 'Assistant'}
                      </p>
                      <div className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      AI is thinking...
                    </span>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>
          <Separator />
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Ask me anything..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !input.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}`;
}
//# sourceMappingURL=chat-component.js.map