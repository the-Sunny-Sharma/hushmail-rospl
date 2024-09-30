"use client";

import { useAuth } from "@/context/AuthProviderClient";
import axios from "axios";
import { Globe, Lock, User, UserX, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export default function CreateFeedPage() {
  const { user } = useAuth();
  const [currentUser, setCurrentUser] = useState({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  });
  const [feedContent, setFeedContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [showIdentity, setShowIdentity] = useState(true);
  const [isAIAssistLoading, setIsAIAssistLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        username: user.email,
        profilePicture: user.picture || currentUser.profilePicture,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/post/my`;

    try {
      const response = await axios.post(url, {
        content: feedContent,
        isPublic,
        username: currentUser.username,
        profilePicture: currentUser.profilePicture,
      });

      if (response.data.success) {
        console.log(response.data.message);
        // You might want to redirect or show a success toast here
      }
    } catch (error) {
      console.error("Error creating post:", error);
      // Handle error accordingly
    } finally {
      setFeedContent("");
      toast.success("Post created successfully");
    }
  };

  const handleAIAssist = async () => {
    setIsAIAssistLoading(true);
    setFeedContent("");
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/suggest-messages`,
        {
          prompt: feedContent,
        }
      );

      // Assuming response follows the structure you've shared
      const aiSuggestion =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text || "";

      setFeedContent(
        (prevContent) =>
          prevContent + (prevContent ? "\n\n" : "") + aiSuggestion
      );
    } catch (error) {
      console.error("Error getting AI assistance:", error);
      toast.error("Error while communicating to AI");
      // Handle error accordingly
    } finally {
      setIsAIAssistLoading(false);
    }
  };

  return (
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
            <div className="mt-1 relative">
              <textarea
                id="feedContent"
                name="feedContent"
                rows={4}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md pr-20"
                placeholder="What's on your mind?"
                value={feedContent}
                onChange={(e) => setFeedContent(e.target.value)}
                required
              />
              <motion.button
                type="button"
                onClick={handleAIAssist}
                disabled={isAIAssistLoading}
                className="absolute bottom-2 right-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isAIAssistLoading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Sparkles className="w-4 h-4 mr-1" />
                    AI Assist
                  </span>
                )}
              </motion.button>
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
            <motion.button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Create Feed
            </motion.button>
          </div>
        </form>
      </div>
    </main>
  );
}
