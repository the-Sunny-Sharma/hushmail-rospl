// import { decode } from "next-auth/jwt";
// import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  // const cookees = cookies().get("authjs.session-token");

  // const secret = process.env.AUTH_SECRET as string; // Assert that this will be a string

  // if (!secret) {
  //   console.error("AUTH_SECRET is not defined in environment variables");
  //   return;
  // }

  // if (cookees) {
  //   const decoded = await decode({
  //     token: cookees.value,
  //     salt: cookees.name,
  //     secret: secret,
  //   });

  //   // console.log(decoded);
  // } else {
  //   console.log("No session token found");
  // }

  return (
    <div>
      <h1 className="underline">Hello World</h1>
      <Link href={"/login"}>Login</Link>
      <br />
      <Link href={"/signup"}>Sign Up</Link>
    </div>
  );
}
