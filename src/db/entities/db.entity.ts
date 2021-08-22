import {Document, Types} from 'mongoose';
import {Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import {toSchema} from "../../schema-helper";

export type DbDocument = Db & Document;

@Schema()
export class Db {
  _id: Types.ObjectId;
  @Prop({default: 1})
  nextIndex: number;

  @Prop({required: true})
  name: string;

  @Prop({type: Types.ObjectId, ref: 'User', required: true})
  owner: Types.ObjectId;
}
export const DbSchema = toSchema(Db);
