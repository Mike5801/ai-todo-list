"use client";
import { TaskElement } from "@/components/TaskElement";
import { Button } from "@/components/ui/button";
import { TaskI } from "@/interfaces/task.interface";
import { postToGpt } from "@/services/openai.service";
import { dbCreateTask, dbGetTasks } from "@/services/task.service";
import useTaskState from "@/stores/task.store";
import { useEffect } from "react";
import { toast } from "sonner";

export default function Home() {
  const tasks = useTaskState((state) => state.tasks);
  const setTasks = useTaskState((state) => state.setTasks);
  const addTasks = useTaskState((state) => state.addTask);
  useEffect(() => {
    async function getTasks() {
      try {
        const response = await dbGetTasks();
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setTasks(data.tasks);
      } catch (error) {
        console.error(error);
      }
    }
    getTasks();
  }, []);

  const handleSubmit = async () => {
    const response = await postToGpt();
    const data = await response.json();
  };

  const handleFormSubmit = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const status = formData.get("status") as string;
    const dueDate = formData.get("dueDate") as unknown as Date;

    try {
      const response = await dbCreateTask(title, status, dueDate);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      const task = data.task;
      const newTask: TaskI = {
        id: task.id,
        title: task.title,
        status: task.status,
        due_date: task.due_date,
      };
      addTasks(newTask);
      toast.success(`Task "${task.title} created successfully"`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col p-5 gap-10">
      <div className="flex flex-col gap-3 w-full justify-center">
        {tasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={parseInt(task.id)}
            title={task.title}
            status={task.status}
            dueDate={task.due_date}
          />
        ))}
      </div>
      <form
        action={handleFormSubmit}
        className="flex justify-between gap-1 items-center"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Task title: </label>
          <input className="border" name="title" id="title" />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="status">Task status: </label>
          <select className="border" name="status" id="status">
            <option value="To do">To do</option>
            <option value="In progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="dueDate">Task due date: </label>
          <input className="border" name="dueDate" id="dueDate" type="date" />
        </div>
        <Button variant={"action"} type="submit">
          Add task
        </Button>
      </form>
    </div>
  );
}
