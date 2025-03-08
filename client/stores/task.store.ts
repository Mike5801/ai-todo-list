import { TaskI } from "@/interfaces/task.interface";
import { create } from "zustand";

interface TaskState {
  tasks: TaskI[];
  setTasks: (tasks: TaskI[]) => void;
  addTask: (task: TaskI) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (task: TaskI) => void;
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
  updateTask: (task) =>
    set((state) => ({
      tasks: state.tasks.map((currTask) => {
        if (currTask.id !== task.id) {
          return currTask;
        } else {
          return task;
        }
      }),
    })),
}));

export default useTaskState;
