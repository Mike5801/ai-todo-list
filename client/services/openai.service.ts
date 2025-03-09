import { NextResponse } from "next/server";
import { TaskExtractionSchema } from "@/schemas/task.schema";
import { zodResponseFormat } from "openai/helpers/zod";
import OpenAI from "openai";
import { TaskI } from "@/interfaces/task.interface";

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function postToGpt(message: string, tasks: TaskI[]): Promise<NextResponse> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an AI assistant that extracts structured data from user messages",
        },
        { role: "user", content: `
          Extract the task title, status, due date, id (if applicable) and the intention (create, read, update or delete) from this message: ${message}. 
          
          If the message is not related to CRUD operations of tasks, populate the specified JSON object with empty string "" and operation READ

          If the intention is create, populate the specified JSON object with the information of the message

          If the intention is read, update or delete, obtain the information of the current existing task from this list: ${JSON.stringify(tasks)} 
          
          If the intention is read, find the most similar task from the list based on title and retrieve this task's data.
          Use this task data to populate the specified JSON object

          If the intent is update, find the most similar task from the list based on title and retrieve the taskId. 
          Use this taskId to populate the taskId attribute of the specified JSON object. Populate the rest of the object with the information that needs to be updated. If no update
          is specified on a field, keep the original information that it has.

          If the intent is delete, find the most similar task from the list based on title and retrieve this task's data.
          Use this task data to populate the specified JSON object


          Here is the specified JSON:
          
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
