import { dbDeleteTaskById } from "@/services/task.service";
import { Button } from "./ui/button";
import useTaskState from "@/stores/task.store";
import { toast } from "sonner";
import { EditModal } from "./EditModal";

interface TaskElementProps {
  taskId: number;
  title: string;
  status: string;
  dueDate: Date;
}

export const TaskElement = ({
  taskId,
  title,
  status,
  dueDate,
}: TaskElementProps) => {
  const date = dueDate.toString().split("T")[0];
  const deleteTask = useTaskState((state) => state.deleteTask);
  const handleDelete = async () => {
    try {
      const response = await dbDeleteTaskById(taskId);
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      const task = data.task;
      deleteTask(task.id);
      toast.success(`Deleted task ${task.title}`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };
  return (
    <div className="w-full flex justify-between bg-slate-50 rounded-sm px-2 shadow-sm">
      <div className="flex gap-2 h-10 items-center">
        {/* Task info */}
        <p
          className={`${
            status === "To do"
              ? "bg-red-500 text-white"
              : status === "In progress"
              ? "bg-yellow-500 text-white"
              : "bg-green-500 text-white"
          } px-2 rounded-sm`}
        >
          {status}
        </p>
        <p>id: {taskId}</p>
        <p>title: {title}</p>
        <p>dueDate: {date}</p>
      </div>
      <div className="flex gap-2 items-center">
        {/* Action buttons */}
        <EditModal key={taskId} taskId={taskId} title={title} status={status} dueDate={dueDate}/>
        <Button size={"sm"} variant={"delete"} onClick={handleDelete}>
          Delete
        </Button>
      </div>
    </div>
  );
};
