import { Arg, Mutation, Resolver, Query } from "type-graphql";
import { TaskRepositoryDomain } from "../../domain/repositories/taskRepository.interface";
import { TaskRepositoryPsql } from "../../repositories/task.repository";
import { TaskType } from "../types/task.type";
import { TaskI } from "../../domain/models/task.interface";

@Resolver()
export class TaskResolver {
  private taskRepository: TaskRepositoryDomain = new TaskRepositoryPsql();

  @Mutation(() => TaskType)
  async createTask(
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ) : Promise<TaskType> {
    const createdTask = await this.taskRepository.createTask(title, status, dueDate);
    return createdTask;
  }

  @Query(() => [TaskType])
  async getTasks() : Promise<TaskType[]> {
    const tasks = await this.taskRepository.getTasks();
    return tasks;
  }

  @Query(() => TaskType)
  async getTaskById(
    @Arg("taskId") taskId: number
  ) : Promise<TaskType> {
    const task = await this.taskRepository.getTaskById(taskId);
    return task
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Arg("taskId") taskId: number,
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ) : Promise<TaskType> {
    const task: TaskI = {
      id: taskId,
      title,
      status,
      due_date: dueDate
    };

    const updatedTask = await this.taskRepository.updateTask(task);
    return updatedTask;
  }

  @Mutation(() => TaskType)
  async deleteTaskById(
    @Arg("taskId") taskId: number
  ) : Promise<TaskType> {
    const deletedTask = await this.taskRepository.deleteTaskById(taskId);
    return deletedTask;
  }

  @Mutation(() => TaskType)
  async deleteAllTasks() : Promise<TaskType[]> {
    const deletedTasks = await this.taskRepository.deleteAllTasks();
    return deletedTasks;
  }
}