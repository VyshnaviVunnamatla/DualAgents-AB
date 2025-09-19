import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User } from "../api"; // Import User from your new API layer
import { Button } from "../components/ui/button"; // Import Button (needed for the non-logged-in state)
import { Brain, Zap, MessageSquare } from "lucide-react";

import AgentInterface from "../components/ai/AgentInterface";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [historyRefresh, setHistoryRefresh] = useState(0); // Still needed to trigger history reload

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not authenticated:", error.message);
        setUser(null);
      }
    };
    loadUser();
  }, []);

  const handleNewMessage = () => {
    setHistoryRefresh(prev => prev + 1); // This will trigger History component to reload if used
  };

  // The login functionality is now handled by the AuthModal in Layout.jsx
  // The Dashboard itself just displays content based on user state.

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-8 max-w-2xl"
        >
          <div className="space-y-4">
            <div className="w-20 h-20 bg-black rounded-2xl mx-auto flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Welcome to <span className="text-white">DualAgents-AB</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-lg mx-auto">
              Experience the power of dual AI agents working simultaneously to answer your questions with precision and speed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 my-12">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
            >
              <Zap className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Simultaneous Processing</h3>
              <p className="text-gray-300 text-sm">Ask multiple questions at once to both AI agents</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
            >
              <Brain className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Intelligent Responses</h3>
              <p className="text-gray-300 text-sm">Get accurate, context-aware answers with web search</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 text-center"
            >
              <MessageSquare className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Conversation History</h3>
              <p className="text-gray-300 text-sm">All your interactions are saved and searchable</p>
            </motion.div>
          </div>

          {/* Login prompt, actual login handled by AuthModal in Layout */}
          <p className="text-gray-400 text-sm mt-8">Please log in to use the AI assistants.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center pt-4 pb-3 px-6"
      >
        <h1 className="text-xl md:text-2xl font-bold text-white mb-1">
          Welcome back, <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">{user.fullName}</span>
        </h1>
        <p className="text-gray-400 text-sm">Your dual AI assistants are ready.</p>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 max-w-8xl w-full mx-auto px-6 pb-6 grid lg:grid-cols-2 gap-6 overflow-hidden">
        {/* Agent 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col"
        >
          <AgentInterface
            agentId="agent-1"
            agentName="Alpha AI"
            agentColor="blue"
            gradientFrom="from-blue-500"
            gradientTo="to-cyan-600"
            onNewMessage={handleNewMessage}
          />
        </motion.div>

        {/* Agent 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700 flex flex-col"
        >
          <AgentInterface
            agentId="agent-2"
            agentName="Beta AI"
            agentColor="purple"
            gradientFrom="from-purple-500"
            gradientTo="to-pink-600"
            onNewMessage={handleNewMessage}
          />
        </motion.div>
      </div>
    </div>
  );
}
