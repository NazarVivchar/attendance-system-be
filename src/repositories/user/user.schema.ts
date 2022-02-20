import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { Check } from '../check/check.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  firstName: string;

  @Prop({ required: true })
  lastName: string;

  @Prop({ required: true })
  avatar: string;

  @Prop()
  faceVector: number[];

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Workspace',
    required: true,
  })
  workspace: Types._ObjectId;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Check',
  })
  lastCheck: Types._ObjectId | Check;
}

export const UserSchema = SchemaFactory.createForClass(User);
