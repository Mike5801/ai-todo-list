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

export const TASK_SUBSCRIPTION_ID = gql`
  subscription($topicId: Int!) {
    taskSubscriptionByTopicId(topicId: $topicId) {
      id
      title
      status
      due_date
      operation
    }
  }
`;
