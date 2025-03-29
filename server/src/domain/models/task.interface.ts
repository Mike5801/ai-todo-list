export interface TaskI {
  id: number;
  title: string;
  status: string;
  due_date: Date;
  operation?: "CREATE" | "UPDATE" | "DELETE";
};