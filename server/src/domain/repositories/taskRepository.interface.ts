import { TaskI } from "../models/task.interface";

export interface TaskRepositoryDomain {
  createTask(title: string, status: string, dueDate: Date): Promise<TaskI>;
  getTasks(): Promise<TaskI[]>;
}