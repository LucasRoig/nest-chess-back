import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Db, DbSchema } from './entities/db.entity';
import { DbGame, DbGameSchema } from './entities/db-game.entity';
import { DbGameService } from './db-game.service';
import { DbGameController } from './db-game.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Db.name, schema: DbSchema },
      { name: DbGame.name, schema: DbGameSchema },
    ]),
  ],
  controllers: [DbController, DbGameController],
  providers: [DbService, DbGameService],
})
export class DbModule {}
