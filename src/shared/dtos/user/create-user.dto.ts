import { IsArray, IsMongoId, IsOptional, IsString } from 'class-validator';
import { Types } from 'mongoose';

export class CreateUserDto {
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
  workspace: Types._ObjectId;
}
