import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User as UserModel } from './user/user.schema';

export const UserAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserModel => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
