import { Injectable, Logger } from '@nestjs/common';
import { CreateDbDto } from './dto/create-db.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Db, DbDocument } from './entities/db.entity';
import {Model, Types} from 'mongoose';
import {User} from "../user/user.schema";
import {DbGameService} from "./db-game.service";
import { DbDocumentService } from './db-document.service';

@Injectable()
export class DbService {
  private readonly logger = new Logger(DbService.name);
  constructor(@InjectModel(Db.name) private dbModel: Model<DbDocument>, private gameService: DbGameService, private textService: DbDocumentService) {}

  async create(createDbDto: CreateDbDto, user: User): Promise<DbDocument> {
    const db = new this.dbModel({ ...createDbDto, owner: user._id });
    return db.save();
  }

  async findAllForUser(user: User): Promise<DbDocument[]> {
    this.logger.log("fetch db for user", user.sub)
    return this.dbModel.find({ owner: user._id }).exec();
  }

  async findOne(id: string): Promise<DbDocument> {
    return this.dbModel.findById(id).exec();
  }

  async remove(id: string): Promise<DbDocument> {
    await this.gameService.deleteAllGamesInDb(Types.ObjectId(id));
    await this.textService.deleteAllDocsInDb(Types.ObjectId(id));
    return this.dbModel.findByIdAndDelete(id).exec();
  }
}
