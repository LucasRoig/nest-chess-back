import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { UserAuth } from './user.decorator';
import { User as UserModel } from './user/user.schema';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  getHello(@UserAuth() user: UserModel): string {
    // console.log(user);
    return this.appService.getHello();
  }
}
