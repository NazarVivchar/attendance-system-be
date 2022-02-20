import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfigService } from './mongoose.service';

@Module({
  imports: [MongooseModule.forRootAsync({ useClass: MongooseConfigService })],
  providers: [MongooseConfigService],
})
export class MongooseConfigModule {}
