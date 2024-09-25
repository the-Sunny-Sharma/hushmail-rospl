"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  MessageCircle,
  Clock,
  ChevronRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProviderClient";

interface Post {
  id: number;
  content: string;
  username: string | null;
  profilePicture: string | null;
  timestamp: string;
  responseCount: number;
  acceptingResponses: boolean;
}

const samplePosts: Post[] = [
  {
    id: 1,
    content:
      "What's your favorite feature of HushMail so far? I'm loving the anonymity options!",
    username: "TechEnthusiast",
    profilePicture: "/placeholder-user.jpg",
    timestamp: "2 minutes ago",
    responseCount: 5,
    acceptingResponses: true,
  },
  {
    id: 2,
    content:
      "Has anyone experienced any bugs with the latest update? I'm having trouble with notifications.",
    username: null,
    profilePicture: null,
    timestamp: "10 minutes ago",
    responseCount: 2,
    acceptingResponses: true,
  },
  {
    id: 3,
    content: "I think we need a dark mode option. What do you all think?",
    username: "NightOwl",
    profilePicture: "/placeholder-user.jpg",
    timestamp: "1 hour ago",
    responseCount: 15,
    acceptingResponses: false,
  },
  {
    id: 4,
    content:
      "How do you balance anonymity with accountability in online discussions?",
    username: null,
    profilePicture: null,
    timestamp: "3 hours ago",
    responseCount: 8,
    acceptingResponses: true,
  },
  {
    id: 5,
    content:
      "What features would you like to see added to HushMail in the future?",
    username: "InnovatorX",
    profilePicture: "/placeholder-user.jpg",
    timestamp: "5 hours ago",
    responseCount: 20,
    acceptingResponses: true,
  },
  {
    id: 6,
    content:
      "Has HushMail improved your ability to give and receive honest feedback?",
    username: null,
    profilePicture: null,
    timestamp: "1 day ago",
    responseCount: 12,
    acceptingResponses: false,
  },
];

export default function FeedLandingPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        username: user.email,
        profilePicture: user.picture || currentUser.profilePicture,
      });
    }
  }, [user]);

  useEffect(() => {
    const savedSidebarState = localStorage.getItem("sidebarOpen");
    if (savedSidebarState !== null) {
      setIsSidebarOpen(JSON.parse(savedSidebarState));
    }
  }, []);

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", JSON.stringify(newState));
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 240 : 64 }}
        className="fixed inset-y-0 left-0 z-50 bg-white shadow-lg"
      >
        <div className="flex items-center justify-between p-4 border-b">
          {isSidebarOpen && <h2 className="text-xl font-semibold">HushMail</h2>}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-gray-200"
          >
            {isSidebarOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
        <nav className="p-2">
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                className="flex items-center p-2 rounded-md hover:bg-gray-200"
              >
                <Home className="w-5 h-5 mr-3" />
                {isSidebarOpen && <span>Home</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard"
                className="flex items-center p-2 rounded-md hover:bg-gray-200"
              >
                <LayoutDashboard className="w-5 h-5 mr-3" />
                {isSidebarOpen && <span>Dashboard</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/settings"
                className="flex items-center p-2 rounded-md hover:bg-gray-200"
              >
                <Settings className="w-5 h-5 mr-3" />
                {isSidebarOpen && <span>Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-60" : "ml-16"
        }`}
        onClick={() => isSidebarOpen && toggleSidebar()}
      >
        <div
          className={`fixed inset-0 bg-black transition-opacity duration-300 ease-in-out ${
            isSidebarOpen ? "opacity-50" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Navbar */}
        <header className="sticky top-0 bg-white shadow-sm z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <h1 className="text-2xl font-bold">HushMail</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  {currentUser.username}
                </span>
                <Image
                  src={currentUser.profilePicture}
                  alt="User profile"
                  width={32}
                  height={32}
                  className="rounded-full border-2 border-gray-200"
                />
              </div>
            </div>
          </div>
        </header>

        {/* Feed grid */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {samplePosts.map((post) => (
                <Link href={`/post/${post.id}`} key={post.id}>
                  <div className="bg-white overflow-hidden shadow-sm rounded-lg hover:shadow-md transition-shadow duration-300 ease-in-out relative">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <Image
                            src={
                              post.profilePicture ||
                              "/placeholder-anonymous.jpg"
                            }
                            alt={post.username || "Anonymous"}
                            width={40}
                            height={40}
                            className="rounded-full"
                          />
                          <span className="text-sm font-medium text-gray-900">
                            {post.username || "Anonymous"}
                          </span>
                        </div>
                        <div
                          className={`w-3 h-3 rounded-full ${
                            post.acceptingResponses
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>
                      <p className="text-base text-gray-700 mb-4 line-clamp-3">
                        {post.content}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.timestamp}
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          {post.responseCount} responses
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2">
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>

        {/* Floating "Post Your Feed" Button */}
        <Link href="/h/create-feed">
          <motion.div
            className="fixed bottom-6 right-6 z-50"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <button
              className="bg-blue-500 text-white rounded-full p-4 shadow-lg flex items-center justify-center"
              aria-label="Post your feed"
            >
              <Plus className="w-6 h-6" />
            </button>
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 right-0"
                >
                  <div className="bg-gray-800 text-white text-sm py-1 px-2 rounded whitespace-nowrap">
                    Post your feed
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </Link>
      </div>
    </div>
  );
}
