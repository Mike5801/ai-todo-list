import axios from "axios";
import { NextResponse } from "next/server";

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL || "";

export async function dbCreateTask(
  title: string,
  status: string,
  dueDate: Date
): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      mutation ($title: String!, $status: String!, $dueDate: DateTimeISO!) {
        createTask(title: $title, status: $status, dueDate: $dueDate) {
          id,
          title,
          status,
          due_date
        }
      }
    `,
    variables: {
      title,
      status,
      dueDate,
    },
  });

  if (dbResponse.data.errors) {
    return NextResponse.json(
      { error: "Failed to create task" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    {
      message: "Task created successfully",
      task: dbResponse.data.data.createTask,
    },
    { status: 201 }
  );
}

export async function dbGetTasks(): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      query {
        getTasks {
          id,
          title,
          status,
          due_date
        }
      }
    `,
  });
  if (dbResponse.data.errors) {
    return NextResponse.json({ error: "Failed to get tasks" }, { status: 500 });
  }
  return NextResponse.json(
    { tasks: dbResponse.data.data.getTasks },
    { status: 200 }
  );
}
