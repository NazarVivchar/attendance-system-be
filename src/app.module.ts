import { Module } from '@nestjs/common';
import { ControllersModule } from './controllers/controllers.module';
import { UseCasesModule } from './use-cases/use-cases.module';
import { ServicesModule } from './services/services.module';
import { RepositoriesModule } from './repositories/repositories.module';
import { MongooseConfigModule } from './mongoose-config/mongoose-config.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ControllersModule,
    UseCasesModule,
    ServicesModule,
    RepositoriesModule,
    MongooseConfigModule,
    SharedModule,
  ],
})
export class AppModule {}
