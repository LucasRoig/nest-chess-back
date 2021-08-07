import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthzModule } from './authz/authz.module';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DbModule } from './db/db.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    UserModule,
    AuthzModule,
    MongooseModule.forRoot('mongodb://localhost:27017/nest-chess'),
    DbModule, //TODO mongo uri from config
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
