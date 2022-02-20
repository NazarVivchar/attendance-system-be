import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Workspace, WorkspaceDocument } from './workspace.schema';
import { WorkspaceModel } from '../../shared/models/workspace.model';
import { CreateWorkspaceDto } from '../../shared/dtos/workspace/create-workspace.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WorkspaceRepository {
  constructor(
    @InjectModel(Workspace.name)
    private readonly workspaceModel: Model<WorkspaceDocument>,
  ) {}

  public async create(
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceModel> {
    const passwordHash = await bcrypt.hash(createWorkspaceDto.password, 10);

    const workspace = await this.workspaceModel.create({
      ...createWorkspaceDto,
      password: passwordHash,
    });

    return this.getByQuery({ _id: workspace._id });
  }

  public getByName(name: string): Promise<WorkspaceModel> {
    return this.getByQuery({ name });
  }

  private getByQuery(query: any): Promise<WorkspaceModel> {
    return this.workspaceModel.findOne(query).lean<WorkspaceModel>().exec();
  }
}
