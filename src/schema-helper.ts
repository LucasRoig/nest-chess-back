import { SchemaFactory } from '@nestjs/mongoose';
import { Type } from '@nestjs/common';
import { Model, Schema } from 'mongoose';


export const toSchema = (
  target: Type,
  options = { strict: true },
): Schema<any, Model<any, any, any>, undefined, any> => {
  const schema = SchemaFactory.createForClass(target);
  schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: (doc, ret) => {
      delete ret._id;
    },
  });
  if (!options.strict) {
    schema.set('strict', false);
  }
  return schema;
};
