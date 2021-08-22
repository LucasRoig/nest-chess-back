import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DbGame, DbGameDocument } from './entities/db-game.entity';
import { Model, Types } from 'mongoose';
import { Db } from './entities/db.entity';
import { DbText, DbTextDocument } from './entities/document.entity';
import { User } from '../user/user.schema';
import { CreateDbDocumentDto } from './dto/create-db-document.dto';

@Injectable()
export class DbDocumentService {
  constructor(
    @InjectModel(DbGame.name) private dbGameModel: Model<DbGameDocument>,
    @InjectModel(Db.name) private dbModel: Model<DbText>,
    @InjectModel(DbText.name)
    private dbDocumentModel: Model<DbTextDocument>,
  ) {}

  async create(
    dto: CreateDbDocumentDto,
    user: User,
    db: Db,
  ): Promise<DbTextDocument> {
    const session = await this.dbDocumentModel.db.startSession();
    const index = db.nextIndex;
    const document = new this.dbDocumentModel({
      ...dto,
      owner: user._id,
      db: db._id,
      index,
    });
    await session.withTransaction(async () => {
      db.nextIndex++;
      await this.dbModel.findByIdAndUpdate(db._id, db);
      await document.save();
    });
    session.endSession();
    return document;
  }

  async findForDb(db: Db): Promise<DbTextDocument[]> {
    return this.dbDocumentModel.find({ db: db._id }).exec();
  }

  async deleteAllDocsInDb(dbId: Types.ObjectId): Promise<
    { ok?: number | undefined; n?: number | undefined } & {
    deletedCount?: number;
  }
    > {
    return this.dbDocumentModel.deleteMany({ db: dbId }).exec();
  }

  async findById(id: Types.ObjectId): Promise<DbTextDocument> {
    return this.dbDocumentModel.findById(id).exec();
  }

  async deleteById(document: DbText): Promise<DbTextDocument> {
    const session = await this.dbDocumentModel.db.startSession();
    let doc: DbTextDocument
    await session.withTransaction(async () => {
      await this.dbGameModel.updateMany({index: {$gt: document.index}, db: {$eq: document.db}}, { $inc: {index: -1} })
      await this.dbDocumentModel.updateMany({index: {$gt: document.index}, db: {$eq: document.db}}, { $inc: {index: -1} })
      await this.dbModel.findByIdAndUpdate(document.db, { $inc: { nextIndex: -1 } });
      doc = await this.dbDocumentModel.findByIdAndDelete(document._id).exec();
    });
    session.endSession();
    return doc;
  }

  async updateOne(id: Types.ObjectId, dto: CreateDbDocumentDto) {
    delete (dto as any).id;
    delete (dto as any).owner;
    delete (dto as any).db;

    return this.dbDocumentModel.updateOne({ _id: id }, { ...dto }).exec();
  }
}
