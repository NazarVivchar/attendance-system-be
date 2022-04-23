import {IsArray, IsMongoId, IsObject, IsString} from 'class-validator';
import { Types } from 'mongoose';
import { Transform } from 'class-transformer';
import {CheckModel} from "./check.model";

export class UserModel {
  @IsMongoId()
  @Transform((_id) => _id.value.toString())
  public _id: Types._ObjectId;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  avatar: string;

  @IsArray()
  faceVector: number[];

  @IsMongoId()
  workspace: Types._ObjectId;

  @IsObject()
  lastCheck: CheckModel;

  @IsArray()
  allChecks: CheckModel[];
}
