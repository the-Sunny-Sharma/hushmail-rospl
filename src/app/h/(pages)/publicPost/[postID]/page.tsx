"use client";

import { useAuth } from "@/context/AuthProviderClient";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { Clock, MessageCircle, Sparkles, User, UserX } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

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

// Define Response type
interface Response {
  _id: string;
  content: string;
  username: string | null;
  profilePicture: string | null;
  timestamp: string;
}

export default function PostDetails({
  params,
}: {
  params: { postID: string };
}) {
  const { user } = useAuth();
  const [isAIAssistLoading, setIsAIAssistLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    username: "",
    profilePicture:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/2048px-Default_pfp.svg.png",
  });
  const [response, setResponse] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [previousResponses, setPreviousResponses] = useState<Response[]>([]);

  useEffect(() => {
    if (user) {
      setCurrentUser({
        username: user.email,
        profilePicture: user.picture || currentUser.profilePicture,
      });
    }
  }, [user]);

  const fetchPostDetails = async () => {
    const response = await fetch(`/api/post/${params.postID}`);
    const post: Post = await response.json();
    setCurrentPost(post);
  };

  const fetchPreviousResponses = async () => {
    const response = await axios.get(`/api/response/public/${params.postID}`);
    setPreviousResponses(response.data);
  };

  useEffect(() => {
    fetchPostDetails();
    fetchPreviousResponses();
  }, [params.postID]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newResponse = {
      content: response,
      username: isAnonymous ? null : currentUser.username,
      profilePicture: isAnonymous ? null : currentUser.profilePicture,
      timestamp: new Date().toISOString(),
    };

    try {
      const res = await axios.post(
        `/api/response/public/${params.postID}`,
        newResponse
      );
      if (res.status === 201) {
        setResponse("");
        alert("Response submitted successfully!");
        fetchPreviousResponses(); // Refresh the previous responses
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit response. Please try again.");
    }
  };

  const handleAIAssist = async () => {
    setIsAIAssistLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    const aiSuggestedResponse =
      "I appreciate the anonymity options in HushMail as well. It provides a sense of security and freedom to express thoughts without fear of judgment. What specific anonymity features do you find most useful?";
    setResponse(
      (prevResponse) =>
        prevResponse + (prevResponse ? "\n\n" : "") + aiSuggestedResponse
    );
    setIsAIAssistLoading(false);
  };

  if (!currentPost) return <div>Loading...</div>;

  return (
    <>
      {/* Post Details and Response Form */}
      <main className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Post Details */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Image
                  src={
                    currentPost.profilePicture || "/placeholder-anonymous.jpg"
                  }
                  alt={currentPost.username || "Anonymous"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
                <span className="text-sm font-medium text-gray-900">
                  {currentPost.username || "Anonymous"}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-4 h-4 mr-1" />
                {formatDistanceToNow(new Date(currentPost.timestamp), {
                  addSuffix: true,
                })}
              </div>
            </div>
            <p className="text-base text-gray-700 mb-4">
              {currentPost.content}
            </p>
            <div className="flex items-center text-sm text-gray-500">
              <MessageCircle className="w-4 h-4 mr-1" />
              {currentPost.responseCount} responses
            </div>
          </div>

          {/* Response Form */}
          <form
            onSubmit={handleSubmit}
            className="p-6 border-b border-gray-200"
          >
            <div className="mb-4">
              <label
                htmlFor="response"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Your Response
              </label>
              <div className="relative">
                <textarea
                  id="response"
                  name="response"
                  rows={4}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Type your response here..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={handleAIAssist}
                  disabled={isAIAssistLoading}
                  className="absolute bottom-2 right-2 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <input
                  id="anonymous"
                  name="anonymous"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <label
                  htmlFor="anonymous"
                  className="ml-2 block text-sm text-gray-900"
                >
                  {isAnonymous ? (
                    <span className="flex items-center">
                      <UserX className="w-4 h-4 mr-1" />
                      Post Anonymously
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      Post as {currentUser.username}
                    </span>
                  )}
                </label>
              </div>
            </div>
            <button
              type="submit"
              className="w-full inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit Response
            </button>
          </form>

          {/* Previous Responses */}
          <div className="p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Previous Responses
            </h3>
            {previousResponses.length === 0 ? (
              <p className="text-gray-500">No responses yet.</p>
            ) : (
              previousResponses.map((resp) => (
                <div key={resp._id} className="mb-4">
                  <div className="flex items-center space-x-3 mb-2">
                    <Image
                      src={resp.profilePicture || "/placeholder-anonymous.jpg"}
                      alt={resp.username || "Anonymous"}
                      width={40}
                      height={40}
                      className="rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {resp.username || "Anonymous"}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatDistanceToNow(new Date(resp.timestamp), {
                        addSuffix: true,
                      })}
                    </div>
                  </div>
                  <p className="text-base text-gray-700">{resp.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </>
  );
}
