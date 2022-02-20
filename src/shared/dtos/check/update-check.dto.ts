import { IsDateString, IsMongoId, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class UpdateCheckDto {
  @IsDateString()
  public in: Date;

  @IsDateString()
  @IsOptional()
  public out: Date;

  @IsMongoId()
  public user: Types._ObjectId;
}
