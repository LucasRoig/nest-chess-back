import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DbGame, DbGameDocument } from './entities/db-game.entity';
import { Model, Types } from 'mongoose';
import { CreateDbGameDto } from './dto/create-db-game.dto';
import { User } from '../user/user.schema';
import { Db, DbDocument } from './entities/db.entity';

@Injectable()
export class DbGameService {
  constructor(
    @InjectModel(DbGame.name) private dbGameModel: Model<DbGameDocument>,
  ) {}

  async create(
    dto: CreateDbGameDto,
    user: User,
    db: Db,
  ): Promise<DbGameDocument> {
    const game = new this.dbGameModel({ ...dto, owner: user._id, db: db._id });
    return game.save();
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

  async deleteById(id: Types.ObjectId): Promise<DbGameDocument> {
    return this.dbGameModel.findByIdAndDelete(id).exec();
  }

  async updateOne(id: Types.ObjectId, dto: CreateDbGameDto) {
    return this.dbGameModel.updateOne({ _id: id }, { ...dto }).exec();
  }
}
