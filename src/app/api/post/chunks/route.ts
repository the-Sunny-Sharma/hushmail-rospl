import { NextResponse } from "next/server";
import { Post } from "@/models/feedModel";
import { connectToDatabase } from "@/lib/connectDB";
import { auth } from "@/auth";

// GET API to fetch public posts in chunks
export const GET = auth(async function GET(req) {
  try {
    if (!req.auth) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    await connectToDatabase();

    // Get query parameters for last timestamp and limit
    const { searchParams } = new URL(req.url);
    const lastTimestamp = searchParams.get("lastTimestamp"); // Timestamp to fetch posts before this time
    const limit = parseInt(searchParams.get("limit") || "5", 10);

    // Build query to fetch posts before the lastTimestamp if provided
    const query: Record<string, any> = { isPublic: true }; // Explicitly define that it can have any string keys

    if (lastTimestamp) {
      query["timestamp"] = { $lt: new Date(lastTimestamp) };
    }

    // Find posts sorted by timestamp, fetch limited number
    const publicPosts = await Post.find(query)
      .sort({ timestamp: -1 }) // Sort by newest first
      .limit(limit);

    // If there are no more posts
    if (publicPosts.length === 0) {
      return NextResponse.json(
        {
          success: true,
          message: "No more posts available",
          posts: [],
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Public posts retrieved successfully",
        posts: publicPosts,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Error fetching posts" },
      { status: 500 }
    );
  }
});
