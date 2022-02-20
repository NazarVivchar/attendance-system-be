import { Module } from '@nestjs/common';
import { UseCasesModule } from '../use-cases/use-cases.module';
import { WorkspaceController } from './workspace.controller';
import { UserController } from './user.controller';
import { ServicesModule } from '../services/services.module';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { StrategiesModule } from '../strategies/strategies.module';

@Module({
  imports: [
    UseCasesModule,
    ServicesModule,
    StrategiesModule,
    PassportModule.register({
      defaultStrategy: 'jwt',
      property: 'workspace',
      session: false,
    }),
  ],
  controllers: [WorkspaceController, UserController, AuthController],
})
export class ControllersModule {}
