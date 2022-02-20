import {
  HttpException,
  HttpService,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { get } from 'lodash';

@Injectable()
export class FaceRecognitionApi {
  private readonly apiUrlBase;

  constructor(private httpService: HttpService) {
    this.apiUrlBase = 'http://localhost:8082';
  }

  async getFaceVector(image: Buffer): Promise<number[]> {
    try {
      const url = `${this.apiUrlBase}/calculate-face-vector`;

      const response = await this.httpService
        .post(url, image.toString('base64'))
        .toPromise();

      return response.data.faceVector;
    } catch (error) {
      const errorMessage = get(
        error,
        'response.statusText',
        'Something went wrong while recognizing person',
      );

      throw new HttpException(errorMessage, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
