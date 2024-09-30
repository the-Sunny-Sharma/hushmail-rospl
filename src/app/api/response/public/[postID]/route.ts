import { connectToDatabase } from "@/lib/connectDB"; // Adjust the import based on your MongoDB connection logic
import { Response } from "@/models/feedModel"; // Ensure the model path is correct
import { NextResponse } from "next/server";

// Handle POST request for submitting a response
export async function POST(
  req: Request,
  { params }: { params: { postID: string } }
) {
  console.log("Response Body", req);
  const { postID } = params;

  // Parse request body
  const body = await req.json();
  const { content, username, profilePicture } = body;

  if (!content) {
    return NextResponse.json({ error: "Content is required" }, { status: 400 });
  }

  try {
    await connectToDatabase();

    const newResponse = await Response.create({
      username,
      content,
      profilePicture,
      postID,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Responded to post successfully",
        responseId: newResponse._id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating response:", error); // Log the error
    return NextResponse.json(
      { error: "Failed to submit response", details: error.message },
      { status: 500 }
    );
  }
}

// Handle GET request for fetching responses of a particular post
export async function GET(
  req: Request,
  { params }: { params: { postID: string } }
) {
  const { postID } = params;

  try {
    await connectToDatabase();
    const responses = await Response.find({ postID }).sort({ timestamp: -1 });

    return NextResponse.json(responses);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch responses" },
      { status: 500 }
    );
  }
}
