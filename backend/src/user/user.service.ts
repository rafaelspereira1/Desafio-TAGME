import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';
import { CreateUserDto } from './create-user.dto';
import { LoginUserDto } from './login-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword: string = await bcrypt.hash(
      createUserDto.password,
      10,
    );
    const createdUser = new this.userModel({
      email: createUserDto.email,
      password: hashedPassword,
    });
    return createdUser.save();
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email });
  }

  async validateUser(loginUserDto: LoginUserDto): Promise<User | null> {
    const user = await this.findByEmail(loginUserDto.email);
    if (user && (await bcrypt.compare(loginUserDto.password, user.password))) {
      return user;
    }
    return null;
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id);
  }

  async update(
    id: string,
    update: Partial<CreateUserDto>,
  ): Promise<User | null> {
    if (update.password) {
      update.password = await bcrypt.hash(update.password, 10);
    }
    return this.userModel.findByIdAndUpdate(id, update, { new: true });
  }

  async delete(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id);
  }
}
