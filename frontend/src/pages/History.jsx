import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SearchHistory } from "../api"; // Import from your new API layer
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Bot, Search, Clock, ChevronDown } from "lucide-react";
import { format } from "date-fns";

export default function History() {
  const [history, setHistory] = useState([]);
  const [filteredHistory, setFilteredHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    let filtered = history;

    if (selectedAgent !== "all") {
      filtered = filtered.filter(item => item.agentId === selectedAgent);
    }

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredHistory(filtered);
  }, [history, searchTerm, selectedAgent]);

  const loadHistory = async () => {
    try {
      // Use the list method from your API layer
      const historyData = await SearchHistory.list('createdAt', 'desc');
      setHistory(historyData);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const agentInfo = {
    "agent-1": { name: "Alpha AI", color: "from-blue-500 to-cyan-600", badge: "bg-blue-600" },
    "agent-2": { name: "Beta AI", color: "from-purple-500 to-pink-600", badge: "bg-purple-600" }
  };

  const handleToggle = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
            <Clock className="w-8 h-8 text-blue-400" />
            Search History
          </h1>
          <p className="text-gray-400 text-lg">Browse and review all your past AI conversations.</p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="sticky top-0 bg-gray-900 z-10 py-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search conversations by keyword..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedAgent("all")}
                className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                  selectedAgent === "all"
                    ? "bg-gray-700 text-white"
                    : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                }`}
              >
                All Agents
              </button>
              {Object.keys(agentInfo).map((agentId) => (
                <button
                  key={agentId}
                  onClick={() => setSelectedAgent(agentId)}
                  className={`px-4 py-2 rounded-lg transition-all text-sm font-medium ${
                    selectedAgent === agentId
                      ? `${agentInfo[agentId].badge} text-white`
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  {agentInfo[agentId].name}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* History Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="space-y-4">
              {Array(6).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-800 rounded-xl h-24"></div>
              ))}
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-16">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                {searchTerm || selectedAgent !== "all" ? "No matches found" : "No history yet"}
              </h3>
              <p className="text-gray-500">
                {searchTerm || selectedAgent !== "all"
                  ? "Try adjusting your search or filter criteria."
                  : "Start asking questions to see your conversation history here."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredHistory.map((item) => (
                <Card key={item._id} className="bg-gray-800 border-gray-700 overflow-hidden">
                  <button onClick={() => handleToggle(item._id)} className="w-full text-left p-6 hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 bg-gradient-to-r ${agentInfo[item.agentId].color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                        <Bot className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{item.question}</p>
                        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                          <Badge variant="outline" className={`${agentInfo[item.agentId].badge} text-white border-none text-xs`}>
                            {agentInfo[item.agentId].name}
                          </Badge>
                          <span>{format(new Date(item.createdAt), "MMMM d, yyyy 'at' h:mm a")}</span>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === item._id ? 'rotate-180' : ''}`} />
                    </div>
                  </button>
                  <AnimatePresence>
                    {expandedId === item._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-gray-700 p-6">
                          <h4 className="text-sm font-semibold text-gray-400 mb-2">AI Answer:</h4>
                          <p className="text-gray-200 whitespace-pre-wrap">{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
