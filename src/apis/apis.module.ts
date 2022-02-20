import { HttpModule, Module } from '@nestjs/common';
import { SharedModule } from '../shared/shared.module';
import { RepositoriesModule } from '../repositories/repositories.module';
import { FaceRecognitionApi } from './face-recognition.api';

@Module({
  imports: [SharedModule, RepositoriesModule, HttpModule],
  providers: [FaceRecognitionApi],
  exports: [FaceRecognitionApi],
})
export class ApisModule {}
