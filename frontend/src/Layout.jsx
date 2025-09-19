import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils";
import { Bot, History, LogOut, User } from "lucide-react";
import { useAuth } from "./context/AuthContext";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar";

const navigationItems = [
  {
    title: "AI Assistant",
    url: createPageUrl("Dashboard"),
    icon: Bot,
    color: "hover:text-blue-400"
  },
  {
    title: "Search History",
    url: createPageUrl("History"),
    icon: History,
    color: "hover:text-purple-400"
  }
];

export default function Layout({ children }) {
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <SidebarProvider>
        <div className="flex w-full min-h-screen">
          <Sidebar className="border-r border-gray-800 bg-gray-900 text-gray-300">
            <SidebarHeader className="border-b border-gray-800 p-6">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10">
                  <div className="absolute inset-0 bg-black rounded-xl"></div>
                  <div className="relative w-full h-full bg-black rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <h2 className="font-bold text-xl text-white">DualAgents-AB</h2>
                  <p className="text-sm text-gray-400">Multi-Agent Assistant</p>
                </div>
              </div>
            </SidebarHeader>
            
            <SidebarContent className="p-4">
              <SidebarGroup>
                <SidebarGroupLabel className="text-white text-xs font-semibold uppercase tracking-wider px-2 py-2">
                  AI Assistant
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-3 py-2 transition-all duration-200 rounded-lg mb-1 font-medium
                            ${item.color} 
                            ${location.pathname === item.url ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800'}`
                          }
                        >
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-gray-800 p-4">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-white text-sm truncate">{user.fullName}</p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </SidebarFooter>
          </Sidebar>

          <main className="flex-1 flex flex-col bg-gray-900">
            <header className="bg-gray-900 border-b border-gray-800 px-6 py-4 md:hidden">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-gray-800 p-2 rounded-lg transition-colors duration-200 text-gray-300" />
                <h1 className="text-xl font-semibold text-white">DualAgents-AB</h1>
              </div>
            </header>

            <div className="flex-1 overflow-auto">
              {children}
            </div>
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
}
