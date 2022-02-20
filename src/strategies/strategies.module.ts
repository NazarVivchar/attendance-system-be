import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { ServicesModule } from '../services/services.module';

@Module({
  imports: [ServicesModule],
  providers: [LocalStrategy, JwtStrategy],
  exports: [LocalStrategy, JwtStrategy],
})
export class StrategiesModule {}
