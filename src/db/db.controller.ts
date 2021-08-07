import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { DbService } from './db.service';
import { CreateDbDto } from './dto/create-db.dto';
import { UserAuth } from '../user.decorator';
import { User } from '../user/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { CreateDbGameDto } from './dto/create-db-game.dto';
import {DbGameService} from "./db-game.service";
import {use} from "passport";

@Controller('api/v1/db')
export class DbController {
  constructor(private readonly dbService: DbService, private readonly gameService: DbGameService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  async create(@Body() createDbDto: CreateDbDto, @UserAuth() user: User) {
    return await this.dbService.create(createDbDto, user);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@UserAuth() user: User) {
    return await this.dbService.findAllForUser(user);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @UserAuth() user: User) {
    const db = await this.dbService.findOne(id);
    if (!db.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return {
      database: db,
      games: await this.gameService.findForDb(db),
    };
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') id: string, @UserAuth() user: User) {
    const db = await this.dbService.findOne(id);
    if (!db.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.dbService.remove(id);
  }

  @Post(':id/games')
  @UseGuards(AuthGuard('jwt'))
  async createGame(
    @Param('id') id: string,
    @UserAuth() user: User,
    @Body() dto: CreateDbGameDto,
  ) {
    const db = await this.dbService.findOne(id);
    if (!db.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.gameService.create(dto, user, db);
  }
}
