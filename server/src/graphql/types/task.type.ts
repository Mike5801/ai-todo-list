import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class TaskType {
  @Field(() => ID)
  id: number;

  @Field(() => String)
  title: string;

  @Field(() => String)
  status: string;

  @Field(() => Date)
  due_date: Date;
}
