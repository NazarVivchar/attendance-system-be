import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { WorkspaceRepository } from '../repositories/workspace/workspace.repository';
import { WorkspaceModel } from '../shared/models/workspace.model';

@Injectable()
export class AuthService {
  constructor(
    private readonly workspaceRepository: WorkspaceRepository,
    private readonly jwtService: JwtService,
  ) {}

  async validateWorkspace(name: string, password: string): Promise<any> {
    const workspace = await this.workspaceRepository.getByName(name);

    if (
      workspace &&
      (await this.passwordsAreEqual(workspace.password, password))
    ) {
      return workspace.name;
    }

    return null;
  }

  async login(workspace: Partial<WorkspaceModel>): Promise<any> {
    const actualWorkspace = await this.workspaceRepository.getByName(
      workspace.name,
    );

    const payload = { name: actualWorkspace.name, sub: actualWorkspace._id };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  private async passwordsAreEqual(
    hashedPassword: string,
    plainPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
