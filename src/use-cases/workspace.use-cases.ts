import {
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { WorkspaceRepository } from '../repositories/workspace/workspace.repository';
import { CreateWorkspaceDto } from '../shared/dtos/workspace/create-workspace.dto';
import { WorkspaceModel } from '../shared/models/workspace.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class WorkspaceUseCases {
  constructor(private readonly workspaceRepository: WorkspaceRepository) {}

  public async create(
    createWorkspaceDto: CreateWorkspaceDto,
  ): Promise<WorkspaceModel> {
    const workspace = await this.workspaceRepository.getByName(
      createWorkspaceDto.name,
    );

    if (workspace) {
      throw new UnprocessableEntityException({
        area: 'WorkspaceUseCases',
        message: 'Workspace already exists',
        attrs: { createWorkspaceDto },
      });
    }

    return this.workspaceRepository.create(createWorkspaceDto);
  }

  public async signIn(name: string, password: string) {
    const workspace = await this.workspaceRepository.getByName(name);
    console.log(workspace);
    if (!workspace) {
      throw new UnauthorizedException({
        area: 'WorkspaceUseCases',
        message: `Workspace name or password is invalid`,
        attrs: { name, passwordReceived: !!password },
      });
    }

    const passwordMatchesHash = await bcrypt.compare(
      password,
      workspace.password,
    );

    if (!passwordMatchesHash) {
      throw new UnauthorizedException({
        area: 'WorkspaceUseCases',
        message: `Workspace name or password is invalid`,
        attrs: { name, passwordReceived: !!password },
      });
    }

    return workspace;
  }

  public async checkExists(name: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.getByName(name);

    return !!workspace;
  }
}
