"use client";

import { useAuth } from "@/context/AuthProviderClient";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Post {
  _id: string;
  content: string;
  username: string | null;
  profilePicture: string | null;
  timestamp: string;
}

export default function LandingPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [currentPostIndex, setCurrentPostIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [lastTimestamp, setLastTimestamp] = useState<string | null>(null);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const hardcodedFallbackPosts: Post[] = [
    {
      _id: "1",
      content: "This is a fallback post.",
      username: "Fallback User",
      profilePicture: null,
      timestamp: new Date().toISOString(),
    },
    // Add more hardcoded posts as needed
  ];

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/post/chunks?limit=5${
          lastTimestamp ? `&lastTimestamp=${lastTimestamp}` : ""
        }`
      );
      if (response.data.success && response.data.posts.length > 0) {
        const newPosts = response.data.posts;
        setPosts((prevPosts) => [...prevPosts, ...newPosts]);
        setLastTimestamp(newPosts[newPosts.length - 1].timestamp); // Update the last timestamp
        setHasMorePosts(true);
      } else {
        // If no more posts, stop fetching and use fallback posts
        setHasMorePosts(false);
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching posts:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
    const timer = setInterval(() => {
      setCurrentPostIndex((prevIndex) => (prevIndex + 1) % posts.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [posts.length]);

  // Trigger fetching when nearing the end of current posts
  useEffect(() => {
    if (currentPostIndex === posts.length - 1 && hasMorePosts && !loading) {
      fetchPosts(); // Fetch the next chunk when near the end of current posts
    }
  }, [currentPostIndex, posts.length, hasMorePosts, loading]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">HushMail</h1>
            </div>
            <div className="flex items-center">
              {user && user.name ? (
                <div className="flex flex-row">
                  <p className="mr-2">
                    Welcome, <span className="text-lg">{user.name}</span>
                  </p>
                  <Image
                    src={
                      user.picture ||
                      "https://upload.wikimedia.org/wikipedia/commons/2/2c/Default_pfp.svg"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-sm font-medium text-white rounded-md"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-lg rounded-lg overflow-hidden h-64">
            <AnimatePresence mode="wait">
              {(posts.length > 0 ? posts : hardcodedFallbackPosts).map(
                (post, index) =>
                  index === currentPostIndex && (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -50 }}
                      transition={{ duration: 0.5 }}
                      className="p-6 h-full flex flex-col justify-between"
                    >
                      <div>
                        <p className="text-lg text-gray-800 mb-4">
                          {post.content}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          {post.profilePicture ? (
                            <Image
                              src={post.profilePicture}
                              alt="Profile Picture"
                              width={16}
                              height={16}
                              className="rounded-full mr-2"
                            />
                          ) : (
                            <span className="w-4 h-4 mr-2 bg-gray-300 rounded-full" />
                          )}
                          <span>{post.username || "Anonymous"}</span>
                        </div>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{new Date(post.timestamp).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  )
              )}
            </AnimatePresence>
          </div>
          <div className="mt-8 text-center">
            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 ease-in-out transform hover:scale-105">
              <Link href={"/h/home"}> Continue to Your Homepage</Link>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
