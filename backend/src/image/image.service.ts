import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Image } from './schemas/image.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { QueryImageDto } from './dto/query-image.dto';

@Injectable()
export class ImageService {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async create(
    createDto: CreateImageDto,
    file: Express.Multer.File,
    userId: string,
  ): Promise<Image> {
    if (!file || !file.buffer) {
      throw new Error('Image file buffer is required');
    }
    const image = new this.imageModel({
      ...createDto,
      data: file.buffer,
      user: new Types.ObjectId(userId),
    });
    return image.save();
  }

  async findAll(
    query: QueryImageDto,
    userId: string,
  ): Promise<{ data: Image[]; total: number }> {
    const filter: Record<string, any> = { user: new Types.ObjectId(userId) };
    if (query.filter) {
      filter.title = { $regex: query.filter, $options: 'i' };
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 10;
    const orderBy = query.orderBy ?? 'createdAt';
    const order = query.order === 'desc' ? -1 : 1;
    const total = await this.imageModel.countDocuments(filter);
    const data = await this.imageModel
      .find(filter)
      .sort({ [orderBy]: order })
      .skip((page - 1) * limit)
      .limit(limit)
      .exec();
    return { data, total };
  }

  async findOne(id: string, userId: string): Promise<Image> {
    const image = await this.imageModel.findById(id);
    if (!image) throw new NotFoundException('Image not found');
    if (image.user.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    return image;
  }

  async update(
    id: string,
    updateDto: UpdateImageDto,
    userId: string,
  ): Promise<Image> {
    const image = await this.imageModel.findById(id);
    if (!image) throw new NotFoundException('Image not found');
    if (image.user.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    Object.assign(image, updateDto);
    return image.save();
  }

  async delete(id: string, userId: string): Promise<Image> {
    const image = await this.imageModel.findById(id);
    if (!image) throw new NotFoundException('Image not found');
    if (image.user.toString() !== userId) {
      throw new ForbiddenException('Access denied');
    }
    await image.deleteOne();
    return image;
  }
}
