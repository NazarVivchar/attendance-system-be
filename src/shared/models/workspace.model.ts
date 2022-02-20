import {
  IsDate,
  IsMongoId,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Types } from 'mongoose';
import { Exclude, Transform } from 'class-transformer';

export class WorkspaceModel {
  @IsMongoId()
  @Transform((_id) => _id.value.toString())
  public _id: Types._ObjectId;

  @IsString()
  @MaxLength(50, {
    message:
      'Name is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  public name: string;

  @IsString()
  @MinLength(8, {
    message:
      'Password is too short. Minimal length is $constraint1 characters, but actual is $value',
  })
  @Exclude({ toPlainOnly: true })
  public password: string;

  @IsDate()
  @Exclude({ toPlainOnly: true })
  public createdAt: Date;

  @IsDate()
  @Exclude({ toPlainOnly: true })
  public updatedAt: Date;

  constructor(partial: Partial<WorkspaceModel>) {
    Object.assign(this, partial);
  }
}
