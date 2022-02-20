import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { AuthService } from '../services/auth.service';
import { WorkspaceModel } from '../shared/models/workspace.model';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super();
  }

  async validate(workspace: Partial<WorkspaceModel>): Promise<any> {
    console.log(workspace);
    const validatedWorkspace = await this.authService.validateWorkspace(
      workspace.name,
      workspace.password,
    );

    if (!validatedWorkspace) {
      throw new UnauthorizedException();
    }

    return validatedWorkspace;
  }
}
