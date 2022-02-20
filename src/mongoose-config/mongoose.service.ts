import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  createMongooseOptions():
    | Promise<MongooseModuleOptions>
    | MongooseModuleOptions {
    const uri =
      'mongodb+srv://admin:7h2L3tH8WYE1bVx1@attendace-system-cluste.vgmxz.mongodb.net/attendance-system?w=majority';
    const options = {
      useNewUrlParser: true,
      poolSize: 3,
      useFindAndModify: false,
      autoIndex: true,
      socketTimeoutMS: 120000,
      useUnifiedTopology: true,
    };

    return {
      uri,
      ...options,
    };
  }
}
