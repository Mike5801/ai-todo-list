import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function postToGpt(message?: string): Promise<NextResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an assistant for general questions",
        },
        { role: "user", content: message || "What is blockchain?" },
      ],
    });
    return NextResponse.json(
      { message: response.choices[0].message?.content },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching response" },
      { status: 500 }
    );
  }
}
