"use client";
import { postToGpt } from "@/services/openai.service";
import { dbGetTasks } from "@/services/task.service";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    async function getTasks() {
      try {
        const response = await dbGetTasks();
        const data = await response.json();

        if (data.tasks) {
          console.log(data.tasks);
        }

      } catch (error) {
        console.error(error);
      }
    }
    getTasks();
  }, [])

  const handleSubmit = async () => {
    const response = await postToGpt();
    const data = await response.json();
    if (data) {
      console.log(data.message);
    }
  }

  return (
    <div>
      <div>Next App</div>
      <button onClick={handleSubmit}>Get AI Response</button>
    </div>
  );
}
