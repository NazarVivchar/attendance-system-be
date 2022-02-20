import { Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { WorkspaceUseCases } from './workspace.use-cases';
import { UserUseCases } from './user.use-cases';
import {ApisModule} from "../apis/apis.module";

@Module({
  imports: [SharedModule, RepositoriesModule, ApisModule],
  providers: [WorkspaceUseCases, UserUseCases],
  exports: [WorkspaceUseCases, UserUseCases],
})
export class UseCasesModule {}
