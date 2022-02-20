import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Check, CheckDocument } from './check.schema';
import { CheckModel } from '../../shared/models/check.model';
import { CreateCheckDto } from '../../shared/dtos/check/create-check.dto';
import { UpdateCheckDto } from '../../shared/dtos/check/update-check.dto';

@Injectable()
export class CheckRepository {
  constructor(
    @InjectModel(Check.name)
    private readonly checkModel: Model<CheckDocument>,
  ) {}

  public async create(createCheckDto: CreateCheckDto): Promise<CheckModel> {
    const check = await this.checkModel.create(createCheckDto);

    return this.getByQuery({ _id: check._id });
  }

  public async update(
    id: Types.ObjectId,
    updateCheckDto: UpdateCheckDto,
  ): Promise<CheckModel> {
    await this.checkModel.updateOne(
      { _id: id },
      { ...updateCheckDto, _id: id },
    );

    return this.getByQuery({ _id: id });
  }

  private getByQuery(query: any): Promise<CheckModel> {
    return this.checkModel.findOne(query).lean<CheckModel>().exec();
  }
}
