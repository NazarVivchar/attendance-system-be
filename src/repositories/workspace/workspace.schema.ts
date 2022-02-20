import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type WorkspaceDocument = Workspace & Document;

@Schema({ timestamps: true })
export class Workspace {
  @Prop({ unique: true, required: true })
  name: string;

  @Prop({ required: true })
  password: string;
}

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
