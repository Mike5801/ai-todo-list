import { TaskI } from "../models/task.interface";

export interface TaskRepositoryDomain {
  createTask(title: string, status: string, dueDate: Date): Promise<TaskI>;
  getTasks(): Promise<TaskI[]>;
  getTaskById(taskId: number): Promise<TaskI>;
  updateTask(task: TaskI): Promise<TaskI>;
  deleteTaskById(taskId: number): Promise<TaskI>;
  deleteAllTasks(): Promise<TaskI[]>
}