import { Prop, Schema } from '@nestjs/mongoose';
import { toSchema } from '../../schema-helper';
import {Document, Types} from 'mongoose';

export type DbGameDocument = DbGame & Document;

@Schema()
export class DbGame {
  _id: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Db', required: true })
  db: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const DbGameSchema = toSchema(DbGame, { strict: false });
