import {
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserUseCases } from '../use-cases/user.use-cases';
import { UserModel } from '../shared/models/user.model';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';

@Controller('users')
export class UserController {
  constructor(private readonly userUseCases: UserUseCases) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new ValidationPipe({ transform: true }))
  create(@UploadedFiles() files: Express.Multer.File[]): Promise<UserModel> {
    return this.userUseCases.create(files);
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files'))
  @UsePipes(new ValidationPipe({ transform: true }))
  update(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UserModel> {
    return this.userUseCases.update(id, files);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  deleteById(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.userUseCases.deleteById(id);
  }
}
