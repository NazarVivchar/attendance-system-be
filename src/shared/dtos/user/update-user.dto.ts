import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateUserDto {
  @IsMongoId()
  _id: Types.ObjectId;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  avatar?: string;

  @IsOptional()
  @IsArray()
  faceVector?: number[];

  @IsMongoId()
  workspace: Types.ObjectId;

  @IsOptional()
  @IsMongoId()
  lastCheck?: Types.ObjectId;
}
