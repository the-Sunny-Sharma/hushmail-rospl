"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Clock, User } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image"; // Importing Next.js Image component
import { useAuth } from "@/context/AuthProviderClient";

interface Post {
  id: number;
  content: string;
  username: string | null;
  timestamp: string;
}

const samplePosts: Post[] = [
  {
    id: 1,
    content: "Great app! Love the anonymity feature.",
    username: "JohnDoe",
    timestamp: "2 minutes ago",
  },
  {
    id: 2,
    content: "How do I change my privacy settings?",
    username: null,
    timestamp: "5 minutes ago",
  },
  {
    id: 3,
    content: "The interface is so intuitive!",
    username: "TechEnthusiast",
    timestamp: "10 minutes ago",
  },
  {
    id: 4,
    content: "Can we have a dark mode option?",
    username: null,
    timestamp: "15 minutes ago",
  },
  {
    id: 5,
    content: "Just discovered this app, it's amazing!",
    username: "NewUser123",
    timestamp: "20 minutes ago",
  },
];

export default function LandingPage() {
  const { user } = useAuth();
  const [currentPostIndex, setCurrentPostIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPostIndex((prevIndex) => (prevIndex + 1) % samplePosts.length);
    }, 6000);

    return () => clearInterval(timer);
  }, []);

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
                  {" "}
                  <div>
                    <p className="mr-2">
                      Welcome, <span className="text-lg">{user.name}</span>
                    </p>
                  </div>
                  <Image
                    src={
                      user.picture
                        ? user.picture
                        : "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png"
                    }
                    alt="User Avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />{" "}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
              <motion.div
                key={currentPostIndex}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.5 }}
                className="p-6 h-full flex flex-col justify-between"
              >
                <div>
                  <p className="text-lg text-gray-800 mb-4">
                    {samplePosts[currentPostIndex].content}
                  </p>
                  <div className="flex items-center text-sm text-gray-600">
                    {samplePosts[currentPostIndex].username ? (
                      <User className="w-4 h-4 mr-2" />
                    ) : (
                      <span className="w-4 h-4 mr-2 bg-gray-300 rounded-full" />
                    )}
                    <span>
                      {samplePosts[currentPostIndex].username || "Anonymous"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{samplePosts[currentPostIndex].timestamp}</span>
                </div>
              </motion.div>
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
