import { createPubSub } from "graphql-yoga";
import { TaskI } from "../../domain/models/task.interface";

export const enum Topic {
  TASKS = "TASKS",
  DYNAMIC_ID_TOPIC = "DYNAMIC_ID_TOPIC"
};

export const pubSub = createPubSub<
  {
    [Topic.TASKS]: [TaskI];
    [Topic.DYNAMIC_ID_TOPIC]: [number, TaskI];
  } & Record<string, [TaskI]>
>();