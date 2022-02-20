import { IsDateString, IsMongoId } from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';

export class CheckModel {
  @IsMongoId()
  @Transform((_id) => _id.value.toString())
  public _id: Types._ObjectId;

  @IsDateString()
  in: Date;

  @IsDateString()
  out: Date;

  @IsMongoId()
  user: Types._ObjectId;

  constructor(partial: Partial<CheckModel>) {
    Object.assign(this, partial);
  }
}
