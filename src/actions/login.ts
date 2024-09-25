"use server";

import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

const credentialsLogin = async (email: string, password: string) => {
  try {
    // console.log(email);
    await signIn("credentials", {
      email,
      password,
    });
  } catch (error) {
    const err = error as CredentialsSignin;
    // console.log("caise,", err.cause, "Mesage", err.message);
    return err.cause;
  }
};

export { credentialsLogin };

// "use server";

// import { signIn } from "@/auth";

// const credentialsLogin = async (email: string, password: string) => {
//   try {
//     const result = await signIn("credentials", {
//       email,
//       password,
//       redirect: false, // Ensure it doesn't redirect but returns a result
//     });

//     if (result?.error) {
//       return result.error; // Return error message if any
//     }

//     return null; // Successful login
//   } catch (error) {
//     return error instanceof Error
//       ? error.message
//       : "An unexpected error occurred";
//   }
// };

// export { credentialsLogin };
