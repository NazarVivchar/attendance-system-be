import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserRepository } from '../repositories/user/user.repository';
import { CreateUserDto } from '../shared/dtos/user/create-user.dto';
import { UserModel } from '../shared/models/user.model';
import { Types } from 'mongoose';
import { UpdateUserDto } from '../shared/dtos/user/update-user.dto';
import { FaceRecognitionApi } from '../apis/face-recognition.api';
import { CheckRepository } from '../repositories/check/check.repository';
import * as moment from 'moment';
import { CreateCheckDto } from '../shared/dtos/check/create-check.dto';
import { UpdateCheckDto } from '../shared/dtos/check/update-check.dto';
import * as fs from 'fs';

@Injectable()
export class UserUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly checkRepository: CheckRepository,
    private readonly faceRecognitionApi: FaceRecognitionApi,
  ) {}

  public async create(files: Express.Multer.File[]): Promise<UserModel> {
    const body = files.find((file) => file.originalname === 'body');
    const avatar = files.find((file) => file.originalname === 'avatar');

    const createUserDto: CreateUserDto = JSON.parse(body.buffer.toString());

    const users = await this.userRepository.getByWorkspace(
      createUserDto.workspace,
    );

    const faceVectorFromImage = await this.faceRecognitionApi.getFaceVector(
      avatar.buffer,
    );

    const user = this.findMostProbableUser(faceVectorFromImage, users || []);

    if (user) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `User with same appearance is already registered`,
        attrs: { createUserDto, id: user._id },
      });
    }

    createUserDto.avatar = avatar.buffer.toString('base64');
    createUserDto.faceVector = faceVectorFromImage;

    return this.userRepository.create(createUserDto);
  }

  public async update(
    id: Types.ObjectId,
    files: Express.Multer.File[],
  ): Promise<UserModel> {
    const body = files.find((file) => file.originalname === 'body');
    const avatar = files.find((file) => file.originalname === 'avatar');

    const updateUserDto: UpdateUserDto = JSON.parse(body.buffer.toString());

    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new UnauthorizedException({
        area: 'UserUseCases',
        message: `User not found`,
        attrs: { id: updateUserDto._id },
      });
    }

    const users = await this.userRepository.getByWorkspace(user.workspace);

    const faceVectorFromImage = await this.faceRecognitionApi.getFaceVector(
      avatar.buffer,
    );

    const mostProbableUser = this.findMostProbableUser(
      faceVectorFromImage,
      users || [],
    );

    if (!mostProbableUser || !user._id.equals(mostProbableUser._id)) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `Can't update user using image of a different person`,
        attrs: { userToUpdateId: id, updateUserDto, mostProbableUser },
      });
    }

    updateUserDto.avatar = avatar.buffer.toString('base64');
    updateUserDto.faceVector = await this.faceRecognitionApi.getFaceVector(
      avatar.buffer,
    );

    return this.userRepository.update(id, updateUserDto);
  }

  public async deleteById(id: Types.ObjectId): Promise<void> {
    const user = await this.userRepository.getById(id);

    if (!user) {
      throw new UnauthorizedException({
        area: 'UserUseCases',
        message: `User not found`,
        attrs: { id },
      });
    }

    await this.userRepository.deleteById(id);
  }

  public getByWorkspace(workspace: Types.ObjectId): Promise<UserModel[]> {
    return this.userRepository.getByWorkspace(workspace);
  }

  public async checkIn(
    workspace: Types._ObjectId,
    files: Express.Multer.File[],
  ): Promise<UserModel> {
    console.log('Check in started');

    const users = await this.userRepository.getByWorkspace(workspace);

    if (!users) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `Workspace has no users assigned`,
        attrs: { workspace },
      });
    }

    const image = files.find((file) => file.originalname === 'image');
    fs.writeFileSync('image-in.jpg', image.buffer);

    const faceVectorFromImage = await this.faceRecognitionApi.getFaceVector(
      image.buffer,
    );

    const user = this.findMostProbableUser(faceVectorFromImage, users);

    if (!user) {
      throw new NotFoundException({
        area: 'UserUseCases',
        message: `User not found`,
      });
    }

    if (user.lastCheck && !user.lastCheck.out) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `You haven already checked in`,
        attrs: { id: user._id },
      });
    }

    const currentUtcDate = moment.utc().toDate();

    const createCheckDto: CreateCheckDto = {
      in: currentUtcDate,
      user: user._id,
    };

    const createdCheck = await this.checkRepository.create(createCheckDto);

    const updateUserDto: UpdateUserDto = {
      ...user,
      lastCheck: createdCheck._id,
    };

    return this.userRepository.update(user._id, updateUserDto);
  }

  public async checkOut(
    workspace: Types._ObjectId,
    files: Express.Multer.File[],
  ): Promise<UserModel> {
    console.log('Check out started');

    const users = await this.userRepository.getByWorkspace(workspace);

    if (!users) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `Workspace has no users assigned`,
        attrs: { workspace },
      });
    }

    const image = files.find((file) => file.originalname === 'image');

    const faceVectorFromImage = await this.faceRecognitionApi.getFaceVector(
      image.buffer,
    );

    const user = this.findMostProbableUser(faceVectorFromImage, users);

    if (!user) {
      throw new NotFoundException({
        area: 'UserUseCases',
        message: `User not found`,
      });
    }

    if (!user.lastCheck) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `You haven't checked in`,
        attrs: { id: user._id },
      });
    }

    if (user.lastCheck && user.lastCheck.out) {
      throw new BadRequestException({
        area: 'UserUseCases',
        message: `You have already checked out`,
        attrs: { id: user._id },
      });
    }

    const currentUtcDate = moment.utc().toDate();

    const updateCheckDto: UpdateCheckDto = {
      ...user.lastCheck,
      out: currentUtcDate,
    };

    await this.checkRepository.update(user.lastCheck._id, updateCheckDto);

    return this.userRepository.getById(user._id);
  }

  private findMostProbableUser(
    faceVector: number[],
    users: UserModel[],
  ): UserModel {
    let userWithMinDistance = null;
    let minDistance = null;

    for (const user of users) {
      const distance = this.findEuclideanDistance(faceVector, user.faceVector);
      console.log(
        `\nEuclidean distance for user "${user.firstName} ${user.lastName}:   ${distance}`,
      );

      if (!minDistance || distance < minDistance) {
        minDistance = distance;
        userWithMinDistance = user;
      }
    }

    return minDistance < 1 ? userWithMinDistance : null;
  }

  private findEuclideanDistance(
    vectorOne: number[],
    vectorTwo: number[],
  ): number {
    return (
      vectorOne
        .map((x, i) => Math.abs(x - vectorTwo[i]) ** 2)
        .reduce((sum, now) => sum + now) **
      (1 / 2)
    );
  }
}
