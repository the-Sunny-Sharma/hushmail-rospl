"use client";

// import { useAuth } from "@/context/AuthProviderClient";
import { Clock, Eye, EyeOff, MessageSquare, Plus } from "lucide-react";
import Link from "next/link";
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

// Define CurrentUser type
// interface CurrentUser {
//   username: string;
//   profilePicture: string;
// }

export default function Dashboard() {
  // const { user } = useAuth();
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  // const [currentUser, setCurrentUser] = useState<CurrentUser>({
  //   username: "",
  //   profilePicture:
  //     "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  // });

  // useEffect(() => {
  //   if (user) {
  //     setCurrentUser({
  //       username: user.email,
  //       profilePicture: user.picture || currentUser.profilePicture,
  //     });
  //   }
  // }, [user]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // In a real application, these would be API calls
    // For this example, we'll use mock data
    const mockStats: DashboardStats = {
      totalPosts: 15,
      totalResponses: 47,
      activePosts: 8,
      publicPosts: 10,
      privatePosts: 5,
      latestResponse: "2 hours ago",
    };

    const mockPosts: Post[] = [
      {
        id: "1",
        content: "What's your favorite programming language?",
        isPublic: true,
        responseCount: 12,
        timestamp: "3 days ago",
      },
      {
        id: "2",
        content: "How do you stay productive while working from home?",
        isPublic: false,
        responseCount: 8,
        timestamp: "1 week ago",
      },
      {
        id: "3",
        content: "What's the best book you've read recently?",
        isPublic: true,
        responseCount: 15,
        timestamp: "2 weeks ago",
      },
    ];

    setStats(mockStats);
    setPosts(mockPosts);
  };

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

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
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Active Posts
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {stats?.activePosts}
                  </dd>
                </dl>
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
            href="/create-post"
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
                  href={`/post/${post.id}`}
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
