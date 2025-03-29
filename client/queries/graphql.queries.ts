import { gql } from "@apollo/client";

export const TASK_SUBSCRIPTION = gql`
  subscription {
    taskSubscription {
      id,
      status,
      title,
      due_date,
      operation
    }
  }
`;