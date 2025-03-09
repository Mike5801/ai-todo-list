import { NextResponse } from "next/server";
import { TaskExtractionSchema } from "@/schemas/task.schema";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function postToGpt(message: string): Promise<NextResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts structured data from user messages",
        },
        { role: "user", content: `
          Extract the task title, status, due date, id (if applicable) and the intention of user (create, read, update or delete) from this message: ${message}. Then, create a JSON object with the next format:
          
          {
            "operation": "CREATE" | "READ" | "UPDATE" | "DELETE"
            "taskId"?: string,
            "title": string,
            "status": "To do" | "In Progress" | "Done",
            "dueDate": Date in ISO format,
          } 
        `}
      ],
      response_format: zodResponseFormat(TaskExtractionSchema, "task_schema_extraction")
    });


    if (response.choices[0].message?.refusal) throw new Error(response.choices[0].message?.refusal);

    return NextResponse.json(
      { message: response.choices[0].message?.content },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching response" },
      { status: 500 }
    );
  }
}
