import { Injectable } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { DbGame, DbGameDocument } from './entities/db-game.entity';
import { connection, Model, Types } from 'mongoose';
import { CreateDbGameDto } from './dto/create-db-game.dto';
import { User } from '../user/user.schema';
import { Db, DbDocument } from './entities/db.entity';
import { DbText, DbTextDocument } from './entities/document.entity';

@Injectable()
export class DbGameService {
  constructor(
    @InjectModel(DbGame.name) private dbGameModel: Model<DbGameDocument>,
    @InjectModel(Db.name) private dbModel: Model<DbDocument>,
    @InjectModel(DbText.name)
    private dbDocumentModel: Model<DbTextDocument>,
  ) {}

  async create(
    dto: CreateDbGameDto,
    user: User,
    db: Db,
  ): Promise<DbGameDocument> {
    const session = await this.dbGameModel.db.startSession();
    const index = db.nextIndex;
    let game = new this.dbGameModel({ ...dto, owner: user._id, db: db._id, index });
    await session.withTransaction(async () => {
      db.nextIndex++;
      await this.dbModel.findByIdAndUpdate(db._id, db);
      await game.save();
    });
    session.endSession();
    return game;
  }

  async findForDb(db: Db): Promise<DbGameDocument[]> {
    return this.dbGameModel.find({ db: db._id }).exec();
  }

  async deleteAllGamesInDb(dbId: Types.ObjectId): Promise<
    { ok?: number | undefined; n?: number | undefined } & {
      deletedCount?: number;
    }
  > {
    return this.dbGameModel.deleteMany({ db: dbId }).exec();
  }

  async findById(id: Types.ObjectId): Promise<DbGameDocument> {
    return this.dbGameModel.findById(id).exec();
  }

  async deleteById(game: DbGame): Promise<DbGameDocument> {
    const session = await this.dbGameModel.db.startSession();
    let doc: DbGameDocument
    await session.withTransaction(async () => {
      await this.dbGameModel.updateMany({index: {$gt: game.index}, db: {$eq: game.db}}, { $inc: {index: -1} })
      await this.dbDocumentModel.updateMany({index: {$gt: game.index}, db: {$eq: game.db}}, { $inc: {index: -1} })
      await this.dbModel.findByIdAndUpdate(game.db, { $inc: { nextIndex: -1 } });
      doc = await this.dbGameModel.findByIdAndDelete(game._id).exec();
    });
    session.endSession();
    return doc;
  }

  async updateOne(id: Types.ObjectId, dto: CreateDbGameDto) {
    delete (dto as any).id;
    delete (dto as any).owner;
    delete (dto as any).db;
    return this.dbGameModel.updateOne({ _id: id }, { ...dto }).exec();
  }
}
