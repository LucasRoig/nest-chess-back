import { Prop, Schema } from '@nestjs/mongoose';
import { toSchema } from '../../schema-helper';
import { Document, Types } from 'mongoose';
import { DbGame } from './db-game.entity';

export type DbTextDocument = DbText & Document;

@Schema()
export class DbText {
  _id: Types.ObjectId;

  @Prop({ required: true })
  index: number;

  @Prop({ required: true })
  title: string;

  @Prop({ type: Types.ObjectId, ref: 'Db', required: true })
  db: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const DbTextSchema = toSchema(DbText, { strict: false });
