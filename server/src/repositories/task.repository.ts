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

  async getTaskById(taskId: number): Promise<TaskI> {
    const query = `SELECT * FROM tasks WHERE id = $1`;
    const { rows } = await db.query(query, [taskId]);
    return rows[0];
  }

  async updateTask(task: TaskI): Promise<TaskI> {
    const query = `UPDATE tasks SET title = $1, status = $2, due_date = $3 WHERE id = $4 RETURNING *`;
    const values = [task.title, task.status, task.due_date, task.id];
    const { rows } = await db.query(query, values);

    return rows[0];
  }

  async deleteTaskById(taskId: number): Promise<TaskI> {
    const query = `DELETEE FROM tasks WHERE id = $1 RETURNING *`;
    const { rows } = await db.query(query, [taskId]);
    return rows[0];
  }

  async deleteAllTasks(): Promise<TaskI[]> {
    const query = `DELETE FROM tasks RETURNING *`;
    const { rows } = await db.query(query);
    return rows[0];
  }
}
