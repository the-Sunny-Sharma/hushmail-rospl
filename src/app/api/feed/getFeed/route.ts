import { NextResponse } from "next/server";
import { Post } from "@/models/feedModel"; // Your Post model
import { connectToDatabase } from "@/lib/connectDB";
import { auth } from "@/auth";

// GET API to fetch all public posts
export const GET = auth(async function GET(req) {
  try {
    // Ensure the user is authenticated
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }
    // Connect to the database
    await connectToDatabase();

    // Find all posts where `isPublic` is true
    const publicPosts = await Post.find({ isPublic: true });

    // Return the list of public posts
    return NextResponse.json(
      { message: "Public posts retrieved successfully", posts: publicPosts },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while fetching public posts" },
      { status: 500 }
    );
  }
});
