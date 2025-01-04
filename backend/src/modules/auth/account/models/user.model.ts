import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserModel {
  @Field(() => Number)
  public id: number;

  @Field(() => String)
  public email: string;

  @Field(() => String)
  public password: string;

  @Field(() => String)
  public username: string;

  @Field(() => String)
  public displayName: string;

  @Field(() => String, { nullable: true })
  public avatar?: string;

  @Field(() => String, { nullable: true })
  public bio?: string;

  @Field(() => Date)
  public createdAt: Date;

  @Field(() => Date, { nullable: true })
  public updatedAt?: Date;
}
