import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from '@nestjs/passport';
import {WorkspaceModel} from "../shared/models/workspace.model";

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // @UseGuards(AuthGuard('local'))
  @Post('log-in')
  async login(@Body() workspace: Partial<WorkspaceModel>) {
    return this.authService.login(workspace);
  }
}
