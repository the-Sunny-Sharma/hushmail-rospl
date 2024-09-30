import { NextResponse } from "next/server";
import { z } from "zod"; // Import Zod
import { Post } from "@/models/feedModel"; // Import your Post model
import { connectToDatabase } from "@/lib/connectDB";
import { auth } from "@/auth";

// Define a Zod schema for post validation
const PostSchema = z.object({
  content: z.string().min(1, "Content is required"), // Ensure content is a non-empty string
  isPublic: z.boolean(), // Ensure isPublic is a boolean
  username: z.string().nullable().optional(), // Optional username
  profilePicture: z.string().nullable().optional(), // Optional profile picture URL
});

// export const GET = auth(function GET(req) {
//   if (req.auth) {
//     return NextResponse.json({ user: req.auth });
//   }
//   return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
// });

export const GET = auth(async function GET(req) {
  try {
    // Ensure the user is authenticated
    if (!req.auth) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Get the authenticated user's email from req.auth
    const userEmail = req.auth.user?.email;

    // Fetch all posts where the username (email) matches the authenticated user's email
    const userPosts = await Post.find({ username: userEmail });

    if (!userPosts || userPosts.length === 0) {
      return NextResponse.json(
        { success: true, message: "No posts found for this user" },
        { status: 404 }
      );
    }

    // Return the user's posts
    return NextResponse.json({ success: true, userPosts }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "An error occurred while fetching posts" },
      { status: 500 }
    );
  }
});

// POST API to create a new post
// export const POST = auth(async function POST(req) {
//   if (!req.auth)
//     return NextResponse.json(
//       { success: false, message: "Not authenticated" },
//       { status: 401 }
//     );
//   try {
//     // Establish a connection to the database
//     await connectToDatabase();

//     // Parse the request body
//     const postData = await req.json();

//     // Validate the incoming data against the schema
//     const validatedData = PostSchema.parse(postData);

//     // Create a new post in the database
//     const newPost = await Post.create({
//       ...validatedData,
//       // username: req.auth.user?.email || req.auth.user?.username, // Use authenticated user's email as username if not provided
//       username: req.auth.user?.email, // Use authenticated user's email as username if not provided
//       profilePicture: req.auth.user?.image, // Use user's profile picture if not provided
//       timestamp: new Date(), // Automatically set the current timestamp
//       responseCount: 0, // Initialize response count to 0
//       acceptingResponses: true, // Default to true
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "New Post added successfully",
//         postId: newPost._id, // Return the new post ID
//       },
//       {
//         status: 201,
//       }
//     );
//   } catch (error) {
//     if (error instanceof z.ZodError) {
//       // Handle validation errors
//       return NextResponse.json(
//         {
//           success: false,
//           message: error.errors,
//         },
//         { status: 400 }
//       );
//     }

//     // Handle other errors (e.g., database errors)
//     console.error(error); // Log the error for debugging
//     return NextResponse.json(
//       {
//         success: false,

//         message: "An error occurred while creating the post",
//       },
//       { status: 500 }
//     );
//   }
// });

export const POST = auth(async function POST(req) {
  if (!req.auth) {
    return NextResponse.json(
      { success: false, message: "Not authenticated" },
      { status: 401 }
    );
  }

  try {
    await connectToDatabase();
    const postData = await req.json();

    // Validate the incoming data against the schema
    const validatedData = PostSchema.parse(postData);

    const newPost = await Post.create({
      ...validatedData,
      username: req.auth.user?.email,
      profilePicture: req.auth.user?.image,
      timestamp: new Date(),
      responseCount: 0,
      acceptingResponses: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: "New Post added successfully",
        postId: newPost._id,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors,
        },
        { status: 400 }
      );
    }

    console.error(error);
    return NextResponse.json(
      {
        success: false,
        message: "An error occurred while creating the post",
      },
      { status: 500 }
    );
  }
});

// DELETE API to delete a post
export const DELETE = auth(async function DELETE(req) {
  try {
    // Ensure the user is authenticated
    if (!req.auth) {
      return NextResponse.json(
        { message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Parse the post ID from the request URL or body (depending on how you send it)
    const { postId } = await req.json(); // Assuming you're sending postId in the request body

    if (!postId) {
      return NextResponse.json(
        { message: "Post ID is required" },
        { status: 400 }
      );
    }

    // Connect to the database
    await connectToDatabase();

    // Find the post by its ID
    const post = await Post.findById(postId);

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    // Ensure the post belongs to the authenticated user (check ownership)
    if (post.username !== req.auth.user?.email) {
      return NextResponse.json(
        { message: "Unauthorized to delete this post" },
        { status: 403 }
      );
    }

    // Delete the post
    await Post.findByIdAndDelete(postId);

    // Return success response
    return NextResponse.json(
      { message: "Post deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the post" },
      { status: 500 }
    );
  }
});
