import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RepositoriesModule } from '../repositories/repositories.module';
import { JwtModule } from '@nestjs/jwt';
import { JWT_SECRET } from '../strategies/jwt.strategy';

@Module({
  imports: [
    RepositoriesModule,
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService],
  exports: [AuthService],
})
export class ServicesModule {}
