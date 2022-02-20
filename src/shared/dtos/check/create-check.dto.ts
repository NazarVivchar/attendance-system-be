import {IsDateString, IsMongoId} from 'class-validator';
import {Types} from "mongoose";

export class CreateCheckDto {
  @IsDateString()
  public in: Date;

  @IsMongoId()
  public user: Types._ObjectId;
}
