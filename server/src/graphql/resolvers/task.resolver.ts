import { Arg, Mutation, Resolver, Query } from "type-graphql";
import { TaskRepositoryDomain } from "../../domain/repositories/taskRepository.interface";
import { TaskRepositoryPsql } from "../../repositories/task.repository";
import { TaskType } from "../types/task.type";

@Resolver()
export class TaskResolver {
  private taskRepository: TaskRepositoryDomain = new TaskRepositoryPsql();

  @Mutation(() => TaskType)
  async createTask(
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ) : Promise<TaskType> {
    return this.taskRepository.createTask(title, status, dueDate);
  }

  @Query(() => [TaskType])
  async getTasks() : Promise<TaskType[]> {
    const tasks = await this.taskRepository.getTasks();
    return tasks as [TaskType];
  }
}