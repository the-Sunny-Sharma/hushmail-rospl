"use client";

import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ChevronRight, Clock, MessageCircle, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

// Define Post type
interface Post {
  _id: string;
  content: string;
  username: string | null;
  profilePicture: string | null;
  timestamp: string;
  responseCount: number;
  acceptingResponses: boolean;
}

export default function FeedLandingPage() {
  const [publicPosts, setPublicPosts] = useState<Post[]>([]);

  const [isHovered, setIsHovered] = useState(false);

  // Implementing Polling mechanism to fetch public posts
  useEffect(() => {
    const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/post`;

    const getPosts = async () => {
      try {
        const response = await axios.get(url);
        console.log("API Response:", response.data);
        setPublicPosts(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    const intervalId = setInterval(getPosts, 5000);
    getPosts();

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {publicPosts.length > 0 ? (
              publicPosts.map((post) => (
                <Link href={`/h/publicPost/${post._id}`} key={post._id}>
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
                          <span>
                            {formatDistanceToNow(new Date(post.timestamp), {
                              addSuffix: true,
                            })}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MessageCircle className="w-4 h-4 mr-1" />
                          <span>{post.responseCount} Responses</span>
                        </div>
                      </div>
                      <ChevronRight className="absolute top-4 right-4 w-5 h-5 text-gray-400" />
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p>No posts available</p>
            )}
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
    </>
  );
}
