import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Send, Bot, User, Loader2, Sparkles } from "lucide-react";
import { InvokeLLM, SearchHistory } from "../../api"; // Import from your new API layer
import { toast } from "sonner"; // For notifications

export default function AgentInterface({ 
  agentId, 
  agentName, 
  agentColor, 
  gradientFrom, 
  gradientTo,
  onNewMessage 
}) {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const question = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message to conversation
    const userMessage = {
      id: Date.now(),
      type: "user",
      content: question,
      timestamp: new Date().toISOString()
    };
    
    setConversation(prev => [...prev, userMessage]);

    try {
      // Get AI response from backend LLM
      const response = await InvokeLLM({
        prompt: `You are ${agentName}, a helpful AI assistant. Answer the following question comprehensively and accurately: ${question}`,
        add_context_from_internet: true
      });

      const aiMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: response,
        timestamp: new Date().toISOString()
      };

      setConversation(prev => [...prev, aiMessage]);

      // Save to history using backend API
      await SearchHistory.create({
        agentId: agentId,
        question: question,
        answer: response,
        sessionId: `session-${Date.now()}`
      });

      onNewMessage && onNewMessage();
      toast.success(`${agentName} answered your query!`);

    } catch (error) {
      console.error("Error getting AI response:", error);
      toast.error(`Error from ${agentName}: ${error.message || 'Failed to get response.'}`);
      const errorMessage = {
        id: Date.now() + 1,
        type: "ai",
        content: "Sorry, I encountered an error while processing your request. Please try again. (Check console for details)",
        timestamp: new Date().toISOString()
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Agent Header */}
      <div className={`p-4 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-t-2xl flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-white text-lg">{agentName}</h3>
            <p className="text-white/80 text-sm">Ask me anything!</p>
          </div>
          <div>
            <Sparkles className="w-5 h-5 text-white/60" />
          </div>
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 bg-gray-800 overflow-y-auto p-4 space-y-4 min-h-0">
        <AnimatePresence>
          {conversation.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center h-full text-center py-8"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-full flex items-center justify-center mb-4`}>
                <Bot className="w-8 h-8 text-white" />
              </div>
              <p className="text-gray-400 text-lg mb-2">I'm {agentName}</p>
              <p className="text-gray-500 text-sm max-w-sm">
                Start a conversation by asking me anything. I can help you with research, analysis, creative tasks, and more!
              </p>
            </motion.div>
          ) : (
            conversation.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.type === 'ai' && (
                  <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg flex items-center justify-center flex-shrink-0 mt-1`}>
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                
                <Card className={`max-w-[85%] ${
                  message.type === 'user' 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'bg-gray-700 border-gray-600'
                }`}>
                  <CardContent className="p-3">
                    <p className={`text-sm whitespace-pre-wrap leading-relaxed ${
                      message.type === 'user' ? 'text-white' : 'text-gray-100'
                    }`}>
                      {message.content}
                    </p>
                  </CardContent>
                </Card>

                {message.type === 'user' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-3 justify-start"
          >
            <div className={`w-8 h-8 bg-gradient-to-r ${gradientFrom} ${gradientTo} rounded-lg flex items-center justify-center mt-1`}>
              <Bot className="w-4 h-4 animate-pulse text-white" />
            </div>
            <Card className="bg-gray-700 border-gray-600">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 text-gray-300">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Input Area - Always visible at bottom */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 rounded-b-2xl flex-shrink-0">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Ask ${agentName} anything...`}
            className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 min-h-[44px] text-base"
            disabled={isLoading}
            autoComplete="off"
          />
          <Button
            type="submit"
            disabled={!input.trim() || isLoading}
            className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} hover:opacity-90 transition-opacity px-6 min-h-[44px]`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
