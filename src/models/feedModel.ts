import mongoose, { Document, Schema } from "mongoose";

// Response Interface
interface IResponse extends Document {
  postId: mongoose.Types.ObjectId; // ID of the post this response belongs to
  content: string; // The response content
  username: string | null; // Null if anonymous
  profilePicture: string | null; // Null if anonymous
  timestamp: Date; // Date when the response was created
}

// Response Schema
const ResponseSchema: Schema = new Schema({
  postId: { type: mongoose.Types.ObjectId, ref: "Post", required: true }, // Reference to Post
  content: { type: String, required: true },
  username: { type: String, default: null },
  profilePicture: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
});

// Post Interface
interface IPost extends Document {
  content: string;
  username: string | null; // Use null for anonymity
  profilePicture: string | null; // Use null for anonymity
  timestamp: Date;
  responseCount: number;
  acceptingResponses: boolean;
  isPublic: boolean;
  responses: mongoose.Types.ObjectId[]; // Store references to responses
}

// Post Schema
const PostSchema: Schema = new Schema({
  content: { type: String, required: true },
  username: { type: String, default: null },
  profilePicture: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  responseCount: { type: Number, default: 0 },
  acceptingResponses: { type: Boolean, default: true }, // Default to true
  isPublic: { type: Boolean, required: true }, // Public or Private
  responses: [{ type: mongoose.Types.ObjectId, ref: "Response" }], // Store references to responses
});

// Export Models
export const Post =
  mongoose.models?.Post || mongoose.model<IPost>("Post", PostSchema);
export const Response =
  mongoose.models?.Response ||
  mongoose.model<IResponse>("Response", ResponseSchema);
