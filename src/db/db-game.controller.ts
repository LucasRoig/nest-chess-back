import {
  Body,
  Controller,
  Delete, Get,
  HttpException,
  HttpStatus,
  Param, Post,
  UseGuards,
} from '@nestjs/common';
import { DbService } from './db.service';
import { DbGameService } from './db-game.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuth } from '../user.decorator';
import { User } from '../user/user.schema';
import { Types } from 'mongoose';
import {CreateDbGameDto} from "./dto/create-db-game.dto";

@Controller('api/v1/games')
export class DbGameController {
  constructor(private readonly gameService: DbGameService) {}

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') idStr: string, @UserAuth() user: User) {
    const id = Types.ObjectId(idStr);
    const game = await this.gameService.findById(id);
    if (!game.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.gameService.deleteById(id);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getOne(@Param('id') idStr: string, @UserAuth() user: User) {
    const game = await this.gameService.findById(Types.ObjectId(idStr));
    if (!game) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (!game.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return game;
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') idStr: string,
    @UserAuth() user: User,
    @Body() dto: CreateDbGameDto,
  ) {
    const game = await this.gameService.findById(Types.ObjectId(idStr));
    if (!game) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (!game.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.gameService.updateOne(Types.ObjectId(idStr), dto);
  }
}
