import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Db, DbSchema } from './entities/db.entity';
import { DbGame, DbGameSchema } from './entities/db-game.entity';
import { DbGameService } from './db-game.service';
import { DbGameController } from './db-game.controller';
import { DbDocumentController } from './db-document.controller';
import { DbDocumentService } from './db-document.service';
import { DbText, DbTextSchema } from './entities/document.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Db.name, schema: DbSchema },
      { name: DbGame.name, schema: DbGameSchema },
      { name: DbText.name, schema: DbTextSchema },
    ]),
  ],
  controllers: [DbController, DbGameController, DbDocumentController],
  providers: [DbService, DbGameService, DbDocumentService],
})
export class DbModule {}
