import { TaskI } from "../domain/models/task.interface";
import { TaskRepositoryDomain } from "../domain/repositories/taskRepository.interface";
import db from "../lib/db";

export class TaskRepositoryPsql implements TaskRepositoryDomain {
  async createTask(
    title: string,
    status: string,
    dueDate: Date
  ): Promise<TaskI> {
    const query = `INSERT INTO tasks (title, status, due_date) VALUES ($1, $2, $3) RETURNING *`;
    const values = [title, status, dueDate];
    const { rows } = await db.query(query, values);

    return rows[0];
  }

  async getTasks(): Promise<TaskI[]> {
    const query = `SELECT * FROM tasks`;
    const { rows } = await db.query(query);
    return rows;
  }
}
