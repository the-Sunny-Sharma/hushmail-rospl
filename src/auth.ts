import { compare } from "bcryptjs";
import NextAuth, { AuthError, CredentialsSignin } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { connectToDatabase } from "./lib/connectDB";
import { User } from "./models/userModel";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      // authorize: async (credentials) => {
      //   try {
      //     // Validate credentials using Zod
      //     const { email, password } = await signInSchema.parseAsync(
      //       credentials
      //     );

      //     if (!email || !password) {
      //       throw new Error("Please provide both email and password.");
      //     }

      //     // Connect to database
      //     await connectToDatabase();

      //     // Find user in the database
      //     const user = await User.findOne({ email }).select("+password");
      //     if (!user) {
      //       throw new Error("Invalid email or password.");
      //     }

      //     // Check if password matches
      //     const isMatch = await compare(password, user.password);
      //     if (!isMatch) {
      //       throw new Error("Invalid email or password.");
      //     }

      //     // Return user data if authentication is successful
      //     return { id: user._id, name: user.name, email: user.email };
      //   } catch (error) {
      //     if (error instanceof ZodError) {
      //       // Return Zod validation errors to the client
      //       const zodError = error.errors.map((e) => e.message).join(", ");
      //       throw new Error(`Validation failed: ${zodError}`);
      //     }
      //     throw new Error(
      //       `Authentication failed: ${error.message}` ||
      //         "Authentication failed."
      //     );
      //   }
      // },
      //No zod
      authorize: async (credentials) => {
        const email = credentials.email as string | undefined;
        const password = credentials.password as string | undefined;
        if (!email || !password)
          throw new CredentialsSignin({
            cause: "Please provide email and password",
          });

        // Connection with database here
        await connectToDatabase();

        const user = await User.findOne({ email }).select("+password");

        if (!user)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });
        if (!user.password)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });
        const isMatch = await compare(password, user.password);

        if (!isMatch)
          throw new CredentialsSignin({ cause: "Invalid Email or Password" });

        return { name: user.name, email: user.email, id: user._id };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    signIn: async ({ user, account }) => {
      if (account?.provider === "google") {
        try {
          const { email, name, image, id } = user;

          if (!email) {
            throw new AuthError("Email is required");
          }
          await connectToDatabase();
          // Only create user if they do not exist
          const alreadyUser = await User.findOne({ email });
          if (!alreadyUser) {
            const username = email.split("@")[0]; // You can modify this logic as per your requirements

            await User.create({
              email,
              name,
              image,
              googleId: id,
              username,
              // Don't include password field as it's not required
            });
          }
          return true;
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          // console.error("Error while creating user:", error.message);
          throw new AuthError("Error while creating user");
        }
      }
      if (account?.provider === "credentials") return true;
      return false;
    },
  },
});
