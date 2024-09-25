"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Menu,
  X,
  Home,
  LayoutDashboard,
  Settings,
  Globe,
  Lock,
  User,
  UserX,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthProviderClient";

export default function CreateFeedPage() {
  const { user } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  });
  const [feedContent, setFeedContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showIdentity, setShowIdentity] = useState(true);

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send a request to your API to create the feed
    console.log({ feedContent, isPublic, showIdentity });
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Navigate to feed page or show success message
    // For example: router.push('/feed')
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
        <nav className="p-4">
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
              <h1 className="text-2xl font-bold">Create Feed</h1>
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

        {/* Create Feed Form */}
        <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <form
              onSubmit={handleSubmit}
              className="space-y-6 bg-white shadow-sm rounded-lg p-6"
            >
              <div>
                <label
                  htmlFor="feedContent"
                  className="block text-sm font-medium text-gray-700"
                >
                  Feed Content
                </label>
                <div className="mt-1">
                  <textarea
                    id="feedContent"
                    name="feedContent"
                    rows={4}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="What's on your mind?"
                    value={feedContent}
                    onChange={(e) => setFeedContent(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Visibility:
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsPublic(!isPublic)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      isPublic ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        isPublic ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="flex items-center text-sm text-gray-700">
                    {isPublic ? (
                      <>
                        <Globe className="w-4 h-4 mr-1" />
                        Public
                      </>
                    ) : (
                      <>
                        <Lock className="w-4 h-4 mr-1" />
                        Private
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">
                    Identity:
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowIdentity(!showIdentity)}
                    className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                      showIdentity ? "bg-indigo-600" : "bg-gray-200"
                    }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                        showIdentity ? "translate-x-5" : "translate-x-0"
                      }`}
                    />
                  </button>
                  <span className="flex items-center text-sm text-gray-700">
                    {showIdentity ? (
                      <>
                        <User className="w-4 h-4 mr-1" />
                        Show
                      </>
                    ) : (
                      <>
                        <UserX className="w-4 h-4 mr-1" />
                        Hide
                      </>
                    )}
                  </span>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Create Feed
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
