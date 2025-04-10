import {
  Arg,
  Mutation,
  Resolver,
  Query,
  Root,
  Subscription,
  type SubscribeResolverData,
  type SubscriptionHandlerData,
  Int,
} from "type-graphql";
import { TaskRepositoryDomain } from "../../domain/repositories/taskRepository.interface";
import { TaskRepositoryPsql } from "../../repositories/task.repository";
import { TaskType } from "../types/task.type";
import { TaskI } from "../../domain/models/task.interface";
import { Topic, pubSub } from "../pubSub/pubsub";

@Resolver()
export class TaskResolver {
  private taskRepository: TaskRepositoryDomain = new TaskRepositoryPsql();

  // Queries and mutations
  @Mutation(() => TaskType)
  async createTask(
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ): Promise<TaskType> {
    const createdTask = await this.taskRepository.createTask(
      title,
      status,
      dueDate
    );
    pubSub.publish(Topic.TASKS, { ...createdTask, operation: "CREATE"});
    return createdTask;
  }
  
  @Mutation(() => TaskType)
  async createTaskAndPublishToTopicIc(
    @Arg("topicId", () => Int) topicId: number,
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ): Promise<TaskType> {
    const createdTask = await this.taskRepository.createTask(
      title,
      status,
      dueDate
    );
    pubSub.publish(Topic.DYNAMIC_ID_TOPIC, topicId, { ...createdTask, operation: "CREATE"});
    return createdTask;
  }

  @Query(() => [TaskType])
  async getTasks(): Promise<TaskType[]> {
    const tasks = await this.taskRepository.getTasks();
    return tasks as TaskI[];
  }

  @Query(() => TaskType)
  async getTaskById(@Arg("taskId") taskId: number): Promise<TaskType> {
    const task = await this.taskRepository.getTaskById(taskId);
    return task;
  }

  @Mutation(() => TaskType)
  async updateTask(
    @Arg("taskId") taskId: number,
    @Arg("title") title: string,
    @Arg("status") status: string,
    @Arg("dueDate") dueDate: Date
  ): Promise<TaskType> {
    const task: TaskI = {
      id: taskId,
      title,
      status,
      due_date: dueDate,
    };

    const updatedTask = await this.taskRepository.updateTask(task);
    pubSub.publish(Topic.TASKS, { ...updatedTask, operation: "UPDATE"});
    return updatedTask;
  }

  @Mutation(() => TaskType)
  async deleteTaskById(@Arg("taskId") taskId: number): Promise<TaskType> {
    const deletedTask = await this.taskRepository.deleteTaskById(taskId);
    pubSub.publish(Topic.TASKS, { ...deletedTask, operation: "DELETE"});
    return deletedTask;
  }

  @Mutation(() => TaskType)
  async deleteAllTasks(): Promise<TaskType[]> {
    const deletedTasks = await this.taskRepository.deleteAllTasks();
    return deletedTasks;
  }
  
  // Subscriptions
  @Subscription({ topics: Topic.TASKS })
  taskSubscription(
    @Root() task: TaskI
  ): TaskType {
    return task;
  }
  
  @Subscription({
    topics: Topic.DYNAMIC_ID_TOPIC,
    topicId: ({ args }: SubscribeResolverData<any, { topicId: number }, any>) => args.topicId,
  })
  taskSubscriptionByTopicId(
    @Arg("topicId", () => Int) _topicId: number,
    @Root() task: TaskI
  ): TaskType {
    return task;
  }
}
