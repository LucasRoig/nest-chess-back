import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserAuth } from '../user.decorator';
import { User } from '../user/user.schema';
import { Types } from 'mongoose';
import { CreateDbGameDto } from './dto/create-db-game.dto';
import { CreateDbDocumentDto } from './dto/create-db-document.dto';
import { DbDocumentService } from './db-document.service';

@Controller('api/v1/documents')
export class DbDocumentController {
  constructor(private readonly documentService: DbDocumentService) {}

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'))
  async remove(@Param('id') idStr: string, @UserAuth() user: User) {
    const id = Types.ObjectId(idStr);
    const document = await this.documentService.findById(id);
    if (!document.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return await this.documentService.deleteById(document);
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getOne(@Param('id') idStr: string, @UserAuth() user: User) {
    const document = await this.documentService.findById(Types.ObjectId(idStr));
    if (!document) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (!document.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return document;
  }

  @Post(':id')
  @UseGuards(AuthGuard('jwt'))
  async update(
    @Param('id') idStr: string,
    @UserAuth() user: User,
    @Body() dto: CreateDbDocumentDto,
  ) {
    const document = await this.documentService.findById(Types.ObjectId(idStr));
    if (!document) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
    }
    if (!document.owner.equals(user._id)) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
    return this.documentService.updateOne(Types.ObjectId(idStr), dto);
  }
}
