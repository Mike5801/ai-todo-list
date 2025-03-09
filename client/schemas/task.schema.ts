import { z } from "zod";

export const TaskExtractionSchema = z.object({
  operation: z.enum(["CREATE", "READ", "UPDATE", "DELETE"]),
  taskId: z.string().optional(),
  title: z.string(),
  status: z.enum(["To do", "In progress", "Done"]),
  dueDate: z.string(),
});

export type TaskExtraction = z.infer<typeof TaskExtractionSchema>