"use client";

import { Clock, Eye, EyeOff, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
import axios from "axios";
import { useEffect, useState } from "react";

interface Post {
  id: string;
  content: string;
  isPublic: boolean;
  responseCount: number;
  timestamp: string;
}

interface DashboardStats {
  totalPosts: number;
  totalResponses: number;
  activePosts: number;
  publicPosts: number;
  privatePosts: number;
  latestResponse: string;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch data from your API (replace with the actual endpoint)
      const response = await axios.get("/api/post/my"); // Ensure correct API route

      // Extract data directly from response
      const data = response.data;

      if (data.success) {
        const userPosts = data.userPosts;

        // Extract stats from posts
        const totalPosts = userPosts.length;
        const totalResponses = userPosts.reduce(
          (acc: number, post: Post) => acc + post.responseCount,
          0
        );
        const activePosts = userPosts.filter(
          (post: Post) => post.acceptingResponses
        ).length;
        const publicPosts = userPosts.filter(
          (post: Post) => post.isPublic
        ).length;
        const privatePosts = totalPosts - publicPosts;
        const latestResponse = new Date(
          Math.max(
            ...userPosts.map((post: Post) => new Date(post.timestamp).getTime())
          )
        ).toLocaleString();

        // Update stats state
        setStats({
          totalPosts,
          totalResponses,
          activePosts,
          publicPosts,
          privatePosts,
          latestResponse,
        });

        // Format posts for UI
        const formattedPosts = userPosts.map((post: Post) => ({
          id: post._id,
          content: post.content,
          isPublic: post.isPublic,
          responseCount: post.responseCount,
          timestamp: new Date(post.timestamp).toLocaleString(),
        }));
        setPosts(formattedPosts);
      }
    } catch (error: unknown) {
      console.error("Failed to fetch dashboard data:", error);
    }
  };

  return (
    <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Posts
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.totalPosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total Responses
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.totalResponses}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-yellow-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Public Posts
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.publicPosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                <EyeOff className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Private Posts
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.privatePosts}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-red-500 rounded-md p-3">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Latest Response
                  </dt>
                  <dd className="text-lg font-semibold text-gray-900">
                    {stats?.latestResponse}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User's posts */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Your Posts</h2>
          <Link
            href="/h/create-feed"
            className="flex items-center text-indigo-600 hover:text-indigo-900"
          >
            <Plus className="w-5 h-5 mr-1" />
            <span>Create New Post</span>
          </Link>
        </div>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul role="list" className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/mypost/${post.id}`}
                  className="block hover:bg-gray-50"
                >
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {post.content}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            post.isPublic
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {post.isPublic ? "Public" : "Private"}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          <MessageSquare className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                          {post.responseCount} responses
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <Clock className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        <p>Posted {post.timestamp}</p>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
