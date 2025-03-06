import { TaskI } from "@/interfaces/task.interface";
import { create } from "zustand";

interface TaskState {
  tasks: TaskI[];
  setTasks: (tasks: TaskI[]) => void;
  addTask: (task: TaskI) => void;
  deleteTask: (taskId: number) => void;
}

const useTaskState = create<TaskState>()((set) => ({
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    })),
}));

export default useTaskState;
