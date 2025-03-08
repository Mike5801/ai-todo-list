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
      mutation($title: String!, $status: String!, $dueDate: DateTimeISO!) {
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

export async function dbGetTaskById(taskId: number): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      query($taskId: Float!) {
        getTaskById(taskId: $taskId) {
          id,
          title,
          status,
          due_date
        }
      }
    `,
    variables: {
      taskId,
    },
  });
  if (dbResponse.data.errors) {
    return NextResponse.json({ error: "Failed to get task" }, { status: 500 });
  }
  return NextResponse.json(
    { task: dbResponse.data.data.getTaskById },
    { status: 200 }
  );
}

export async function dbUpdateTask(
  taskId: number,
  title: string,
  status: string,
  dueDate: Date
): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      mutation($taskId: Float!, $title: String!, $status: String!, $dueDate: DateTimeISO!) {
        updateTask(taskId: $taskId, title: $title, status: $status, dueDate: $dueDate) {
          id,
          title,
          status,
          due_date
        }
      }
    `,
    variables: {
      taskId,
      title,
      status,
      dueDate,
    },
  });
  if (dbResponse.data.errors) {
    return NextResponse.json(
      { error: "Failed to updatee task" },
      { status: 500 }
    );
  }
  return NextResponse.json(
    {
      message: "Task updated successfully",
      task: dbResponse.data.data.updateTask,
    },
    { status: 200 }
  );
}

export async function dbDeleteTaskById(taskId: string): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      mutation($taskId: !String) {
        deleteTaskById(taskId: $taskId) {
          id,
          title,
          status,
          due_date
        }
      }
    `,
    variables: {
      taskId,
    },
  });
  if (dbResponse.data.errors) {
    return NextResponse.json(
      { error: "Failed to delete task" },
      { status: 500 }
    );
  }
  return NextResponse.json({
    message: "Task deleted successfully",
    task: dbResponse.data.data.deleteTaskById,
  });
}

export async function dbDeleteAllTasks(): Promise<NextResponse> {
  const dbResponse = await axios.post(graphqlUrl, {
    query: `
      mutation {
        deleteAllTasks {
          id,
          title,
          status,
          due_date
        }
      }
    `,
  });

  if (dbResponse.data.errors) {
    return NextResponse.json(
      { message: "Failed deleting all tasks" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: "All tasks deleted successfully",
      tasks: dbResponse.data.data.deleteAllTAsks,
    },
    { status: 200 }
  );
}
