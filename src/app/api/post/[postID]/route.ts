import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/connectDB";
import { Post } from "@/models/feedModel";

export async function GET(
  request: Request,
  { params }: { params: { postID: string } }
) {
  const { postID } = params;

  try {
    await connectToDatabase();
    const post = await Post.findById(postID); // Use the appropriate method based on your ORM
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }
    return NextResponse.json(post);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.json(
      { message: "An error occurred while fetching post details" },
      { status: 500 }
    );
  }
}
