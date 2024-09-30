import { NextResponse } from "next/server";

// Replace with your actual Google API key
const googleApiKey = process.env.GEMINI_API_KEY;

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const prompt =
      "Create one open-ended and engaging question for an anonymous social messaging platform, like Qooh.me. The question should be suitable for a diverse audience, avoiding personal or sensitive topics. Focus on universal themes that encourage friendly interaction and curiosity. Ensure it contributes to a positive and welcoming conversational environment.";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${googleApiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch from Google API: ${response.status}`);
    }

    const data = await response.json();

    // Handle the response from the Gemini API here
    return NextResponse.json(data);
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
