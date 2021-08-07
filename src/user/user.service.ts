import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(sub: string): Promise<User> {
    const u = new this.userModel({ sub });
    return u.save();
  }

  async findOneBySub(sub: string): Promise<User | undefined> {
    return this.userModel.findOne({ sub });
  }
}
