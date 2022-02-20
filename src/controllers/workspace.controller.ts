import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { WorkspaceUseCases } from '../use-cases/workspace.use-cases';
import { WorkspaceModel } from '../shared/models/workspace.model';
import { CreateWorkspaceDto } from '../shared/dtos/workspace/create-workspace.dto';
import { SignInToWorkspaceDto } from '../shared/dtos/workspace/signIn-to-workspace.dto';
import { Types } from 'mongoose';
import { UserModel } from '../shared/models/user.model';
import { UserUseCases } from '../use-cases/user.use-cases';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('workspaces')
export class WorkspaceController {
  constructor(
    private readonly workspaceUseCases: WorkspaceUseCases,
    private readonly userUseCases: UserUseCases,
  ) {}

  @Get(':name/exists')
  @UsePipes(new ValidationPipe({ transform: true }))
  checkExists(@Param('name') name: string): Promise<boolean> {
    return this.workspaceUseCases.checkExists(name);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(
    @Body() createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceModel> {
    const workspace = await this.workspaceUseCases.create(createWorkspaceDto);

    return new WorkspaceModel(workspace);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post(':name/sign-in')
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(
    @Param('name') name: string,
    @Body() signInToWorkspaceDto: SignInToWorkspaceDto,
  ): Promise<WorkspaceModel> {
    const workspace = await this.workspaceUseCases.signIn(
      name,
      signInToWorkspaceDto.password,
    );

    return new WorkspaceModel(workspace);
  }

  @Get(':id/users')
  @UsePipes(new ValidationPipe({ transform: true }))
  getUsers(@Param('id') id: Types.ObjectId): Promise<UserModel[]> {
    return this.userUseCases.getByWorkspace(id);
  }

  @Post(':id/check-in')
  @UseInterceptors(FilesInterceptor('files'))
  checkIn(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UserModel> {
    return this.userUseCases.checkIn(id, files);
  }

  @Post(':id/check-out')
  @UseInterceptors(FilesInterceptor('files'))
  checkOut(
    @Param('id') id: Types.ObjectId,
    @UploadedFiles() files: Express.Multer.File[],
  ): Promise<UserModel> {
    return this.userUseCases.checkOut(id, files);
  }
}
