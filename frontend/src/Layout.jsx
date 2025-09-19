import React, { useState } from "react"; // Added useState
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "./utils"; // Changed to local utils
import { Bot, History, FileText, Bell, Bookmark, Timer, LogOut, User as UserIcon, X, Loader2 } from "lucide-react"; // Renamed User to UserIcon
import { User } from "./api"; // Import User from your new API layer
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "./components/ui/sidebar"; // Changed to local path for shadcn component
import { Button } from "./components/ui/button"; // Changed to local path
import { Input } from "./components/ui/input"; // Changed to local path
import { motion } from "framer-motion"; // Added motion
import { toast } from "sonner"; // Added toast

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

const personalItems = [
  {
    title: "Personal Notes",
    url: createPageUrl("Notes"),
    icon: FileText,
    color: "hover:text-green-400"
  },
  {
    title: "Personal Reminders",
    url: createPageUrl("Reminders"),
    icon: Bell,
    color: "hover:text-orange-400"
  },
  {
    title: "Quick Links",
    url: createPageUrl("Bookmarks"),
    icon: Bookmark,
    color: "hover:text-cyan-400"
  },
  {
    title: "Focus Timer",
    url: createPageUrl("FocusTimer"),
    icon: Timer,
    color: "hover:text-pink-400"
  }
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [user, setUser] = React.useState(null);
  const [showAuthModal, setShowAuthModal] = React.useState(false);

  React.useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        console.log("User not authenticated:", error.message);
        setUser(null); // Ensure user state is null if not authenticated
        // Show auth modal only if not on Dashboard and not already showing
        if (location.pathname !== createPageUrl("Dashboard") && !showAuthModal) {
            setShowAuthModal(true);
        }
      }
    };
    loadUser();
  }, [location.pathname, showAuthModal]); // Added showAuthModal to dependencies

  const handleLogout = async () => {
    try {
      await User.logout();
      setUser(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleLoginRegisterSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    setShowAuthModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <style>{`
        :root {
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --popover: 222.2 84% 4.9%;
          --popover-foreground: 210 40% 98%;
          --primary: 217.2 91.2% 59.8%;
          --primary-foreground: 222.2 84% 4.9%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --destructive: 0 62.8% 30.6%;
          --destructive-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 224.3 76.3% 94.0%;
        }
      `}</style>
      
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
              {/* AI Assistant Section */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-2 py-2">
                  AI Assistant
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {navigationItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-gray-800 ${item.color} transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-gray-800 text-blue-400' : 'text-gray-300'
                          }`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Personal Productivity Section */}
              <SidebarGroup>
                <SidebarGroupLabel className="text-gray-400 text-xs font-semibold uppercase tracking-wider px-2 py-2">
                  Personal Productivity
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {personalItems.map((item) => (
                      <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                          asChild 
                          className={`hover:bg-gray-800 ${item.color} transition-all duration-200 rounded-lg mb-1 ${
                            location.pathname === item.url ? 'bg-gray-800' : 'text-gray-300'
                          } ${location.pathname === item.url && item.title === 'Personal Notes' ? 'text-green-400' : ''}
                          ${location.pathname === item.url && item.title === 'Personal Reminders' ? 'text-orange-400' : ''}
                          ${location.pathname === item.url && item.title === 'Quick Links' ? 'text-cyan-400' : ''}
                          ${location.pathname === item.url && item.title === 'Focus Timer' ? 'text-pink-400' : ''}`}
                        >
                          <Link to={item.url} className="flex items-center gap-3 px-3 py-2">
                            <item.icon className="w-4 h-4" />
                            <span className="font-medium">{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
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
                      <UserIcon className="w-4 h-4 text-white" /> {/* Renamed from User to UserIcon */}
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
                <button
                  onClick={() => setShowAuthModal(true)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-400 hover:text-blue-400 hover:bg-gray-800 rounded-lg transition-all duration-200"
                >
                  <UserIcon className="w-4 h-4" /> {/* Renamed from User to UserIcon */}
                  Sign In
                </button>
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

      {showAuthModal && ( // Only render if showAuthModal is true
        <AuthModal onClose={() => setShowAuthModal(false)} onLoginRegisterSuccess={handleLoginRegisterSuccess} />
      )}
    </div>
  );
}

// AuthModal Component - now a separate file (src/components/auth/AuthModal.jsx)
