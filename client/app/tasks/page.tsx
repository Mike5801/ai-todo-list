"use client";
import { useSubscription } from "@apollo/client";
import useTaskState from "@/stores/task.store";
import { TASK_SUBSCRIPTION } from "@/queries/graphql.queries";
import { TaskI } from "@/interfaces/task.interface";
import { useEffect } from "react";
import { TaskElement } from "@/components/TaskElement";
import { dbGetTasks } from "@/services/task.service";

export default function Tasks() {
  const tasks = useTaskState((state) => state.tasks);
  const addTask = useTaskState((state) => state.addTask);
  const setTasks = useTaskState((state) => state.setTasks);
  const { data: createTaskSubscription, loading, error } = useSubscription(TASK_SUBSCRIPTION);

  useEffect(() => {
    function syncTask() {
      if (!loading && !error) {
        const response = createTaskSubscription.taskSubscription;
        const task: TaskI = { 
          id: response.id,
          title: response.title,
          status: response.status,
          due_date: response.due_date
        };
        addTask(task);
      }
    }
    
    async function getTasks() {
      try {
        const response = await dbGetTasks();
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        setTasks(data.tasks);
      } catch (erro) {
        console.error(error);
      }
    }

    if (tasks.length === 0) {
      getTasks();
    }
    syncTask();
  }, [createTaskSubscription]);
  
  return (
    <div className="flex flex-col p-5 gap-10">
      <div className="flex flex-col gap-3 w-full justify-center">
        {tasks.map((task) => (
          <TaskElement
            key={task.id}
            taskId={parseInt(task.id)}
            title={task.title}
            status={task.status}
            dueDate={task.due_date}
          />
        ))}
      </div>
    </div>
  );
};