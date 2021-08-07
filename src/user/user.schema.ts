import {Document, Types} from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  // // @Prop({})
  _id: Types.ObjectId;

  @Prop({ required: true })
  sub: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
