import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from '../../shared/dtos/user/create-user.dto';
import { UserModel } from '../../shared/models/user.model';
import { UpdateUserDto } from '../../shared/dtos/user/update-user.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
  ) {}

  public async create(createUserDto: CreateUserDto): Promise<UserModel> {
    const user = await this.userModel.create(createUserDto);

    return this.getByQuery({ _id: user._id });
  }

  public async update(
    id: Types.ObjectId,
    updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    await this.userModel.updateOne({ _id: id }, { ...updateUserDto, _id: id });

    return this.getByQuery({ _id: id });
  }

  public async deleteById(id: Types._ObjectId): Promise<void> {
    await this.userModel.deleteOne({ _id: id });
  }

public getById(id: Types._ObjectId | string): Promise<UserModel> {
    return this.getByQuery({ _id: id });
  }

  public getByWorkspace(workspace: Types._ObjectId): Promise<UserModel[]> {
    return this.getMultipleByQuery({ workspace });
  }

  private getByQuery(query: any): Promise<UserModel> {
    return this.userModel
      .findOne(query)
      .populate('lastCheck')
      .populate({
        path: 'allChecks',
        model: 'Check',
      })
      .lean<UserModel>()
      .exec();
  }

  private getMultipleByQuery(query: any): Promise<UserModel[]> {
    return this.userModel
      .find(query)
      .populate('lastCheck')
      .populate({
        path: 'allChecks',
        model: 'Check',
      })
      .lean<UserModel[]>()
      .exec();
  }
}
