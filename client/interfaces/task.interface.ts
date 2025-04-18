export interface TaskI {
  id: string;
  title: string;
  status: string;
  due_date: Date;
  operation?: "CREATE" | "UPDATE" | "DELETE";
};