"use client";

import { useEffect } from "react";
import { TASK_SUBSCRIPTION } from "@/queries/graphql.queries";
import { useSubscription } from "@apollo/client";
import useTaskState from "@/stores/task.store";
import { TaskI } from "@/interfaces/task.interface";

export const SubscriptionTask = () => {
  const addTasks = useTaskState((state) => state.addTask);
  const { data, loading, error} = useSubscription(TASK_SUBSCRIPTION);
  useEffect(() => {
    function syncTask() {
      if (!loading && !error) {
        const response = data.taskSubscription;
        const task: TaskI = {
          id: response.id,
          title: response.title,
          status: response.status,
          due_date: response.due_date
        };
        addTasks(task);
      }
    }
    syncTask();
  }, [data])
  return (
    <div className="flex flex-col gap-2">
    {
      data 
      ? (
        <div>
          id: {data.taskSubscription.id} | title: {data.taskSubscription.title} | status: {data.taskSubscription.status} | due_date: {data.taskSubscription.due_date.toString().split("T")[0]}
        </div>
      )
      : (<p>No received object</p>)
    }
    </div>
  )
}