import { Module } from '@nestjs/common';
import { WorkspaceRepository } from './workspace/workspace.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Workspace, WorkspaceSchema } from './workspace/workspace.schema';
import { User, UserSchema } from './user/user.schema';
import { UserRepository } from './user/user.repository';
import { Check, CheckSchema } from './check/check.schema';
import { CheckRepository } from './check/check.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Workspace.name, schema: WorkspaceSchema },
      { name: User.name, schema: UserSchema },
      { name: Check.name, schema: CheckSchema },
    ]),
  ],
  providers: [WorkspaceRepository, UserRepository, CheckRepository],
  exports: [WorkspaceRepository, UserRepository, CheckRepository],
})
export class RepositoriesModule {}
