"use client"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button";
import { dbUpdateTask } from "@/services/task.service";
import { toast } from "sonner";
import useTaskState from "@/stores/task.store";
import { useState } from "react";

interface EditModalProps {
  taskId: number;
  title: string;
  status: string;
  dueDate: Date;
}

export const EditModal = ({ taskId, title, status, dueDate } : EditModalProps) => {
  const updateTask = useTaskState((state) => state.updateTask);
  const [open, setOpen] = useState(false);
  
  const handleSubmit = async (formData: FormData) => {
    try {
      const title = formData.get("title") as string;
      const status = formData.get("status") as string;
      const dueDate = formData.get("dueDate") as unknown as Date;
  
      const response = await dbUpdateTask(taskId, title, status, dueDate);
      const data = await response.json();
  
      if (!response.ok) throw new Error(data.error);

      const task = data.task;
      updateTask(task);
      setOpen(false);
      toast.success("Task updated successfully");
    } catch (error: any) {
      toast.error(error.message)
    }
  }
  
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"action"} onClick={() => {
          setOpen(true);
        }}>
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit task: "{title}"</DialogTitle>
          <DialogDescription hidden></DialogDescription>
        </DialogHeader>
        <form 
          action={handleSubmit}
          className="flex flex-col justify-between gap-3"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="title">Task title: </label>
            <input className="border" name="title" id="title" defaultValue={title}/>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="status">Task status: </label>
            <select className="border" name="status" id="status" defaultValue={status}>
              <option value="To do">To do</option>
              <option value="In progress">In Progress</option>
              <option value="Done">Done</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="dueDate">Task due date: </label>
            <input className="border" name="dueDate" id="dueDate" type="date" defaultValue={dueDate.toString().split("T")[0]}/>
          </div>
            <Button className="mt-5" variant={"action"} type="submit">Update task</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}