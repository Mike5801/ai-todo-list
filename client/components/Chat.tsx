"use client";
import { useState } from "react";
import { Button } from "./ui/button";
import { SendHorizonal, X } from "lucide-react";
import { postToGpt } from "@/services/openai.service";
import { TaskExtraction } from "@/schemas/task.schema";
import useTaskState from "@/stores/task.store";
import { TaskI } from "@/interfaces/task.interface";
import {
  dbCreateTask,
  dbDeleteTaskById,
  dbUpdateTask,
} from "@/services/task.service";
import { toast } from "sonner";

interface ChatProps {
  closeChat: () => void;
}

export const Chat = ({ closeChat }: ChatProps) => {
  const [messages, setMessages] = useState<string[]>([]);
  const tasks = useTaskState((state) => state.tasks);
  const addTask = useTaskState((state) => state.addTask);
  const updateTask = useTaskState((state) => state.updateTask);
  const deleteTask = useTaskState((state) => state.deleteTask);
  const handleSubmit = async (formData: FormData) => {
    const userMessage = formData.get("userMessage") as string;
    setMessages([...messages, userMessage]);
    try {
      const response = await postToGpt(userMessage, tasks);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const taskInfo = JSON.parse(data.message) as TaskExtraction;

      console.log(taskInfo);

      switch (taskInfo.operation) {
        case "CREATE": {
          const response = await dbCreateTask(
            taskInfo.title,
            taskInfo.status,
            new Date(taskInfo.dueDate)
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          const task = data.task;
          const newTask: TaskI = {
            id: task.id,
            title: task.title,
            status: task.status,
            due_date: task.due_date,
          };
          addTask(newTask);
          toast.success("Task created successfully through Chat bot");
          break;
        }

        case "READ": {
          const retrievedTask: TaskI = {
            id: taskInfo.taskId!,
            title: taskInfo.title,
            status: taskInfo.status,
            due_date: new Date(taskInfo.dueDate),
          };

          setMessages([
            ...messages,
            `Retrieved task ${JSON.stringify(retrievedTask)}`,
          ]);
          break;
        }

        case "UPDATE": {
          const response = await dbUpdateTask(
            parseInt(taskInfo.taskId!),
            taskInfo.title,
            taskInfo.status,
            new Date(taskInfo.dueDate)
          );
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          const task = data.task;
          const updatedTask: TaskI = {
            id: task.id,
            title: task.title,
            status: task.status,
            due_date: task.due_date,
          };
          updateTask(updatedTask);
          toast.success("Task updated successfully through chat bot");
          break;
        }

        case "DELETE": {
          const response = await dbDeleteTaskById(parseInt(taskInfo.taskId!));
          const data = await response.json();
          if (!response.ok) throw new Error(data.error);
          const task = data.task;
          const deletedTask: TaskI = {
            id: task.id,
            title: task.title,
            status: task.status,
            due_date: task.due_date,
          };
          deleteTask(deletedTask.id);
          toast.success("Task deleted successfully through chat bot");
          break;
        }

        default:
          throw new Error("No valid operation extracted");
      }
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="absolute bottom-14 right-14 h-72 rounded-sm shadow-sm w-72 bg-slate-50 p-3">
      <div className="flex justify-end items-center relative">
        <Button
          className="w-5 h-5 absolute"
          variant={"outline"}
          onClick={closeChat}
        >
          <X />
        </Button>
      </div>
      <div className="h-full flex flex-col gap-3 justify-between">
        {/* Messages */}
        <div className="flex flex-col gap-1 overflow-y-auto justify-center">
          {messages.map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
        {/* Input chat */}
        <form action={handleSubmit} className="flex gap-2">
          <input
            name="userMessage"
            className="border w-full px-2"
            type="text"
            placeholder="enter message"
          />
          <Button size={"sm"} variant={"action"} type="submit">
            <SendHorizonal />
          </Button>
        </form>
      </div>
    </div>
  );
};
