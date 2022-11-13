import {
  Body,
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
import { UpdateUserDto } from '../shared/dtos/user/update-user.dto';

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

  @Put(':id/simple')
  @UsePipes(new ValidationPipe({ transform: true }))
  updateSimple(
    @Param('id') id: Types.ObjectId,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserModel> {
    return this.userUseCases.updateSimple(id, updateUserDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe({ transform: true }))
  deleteById(@Param('id') id: Types.ObjectId): Promise<void> {
    return this.userUseCases.deleteById(id);
  }
}
