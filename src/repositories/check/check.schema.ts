import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';

export type CheckDocument = Check & Document;

@Schema({ timestamps: true })
export class Check {
  @Prop({ required: true })
  in: Date;

  @Prop()
  out: Date;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'User',
  })
  user: Types._ObjectId;
}

export const CheckSchema = SchemaFactory.createForClass(Check);
