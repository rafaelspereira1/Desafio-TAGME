jest.setTimeout(30000);

import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ImageService } from './image.service';
import { Image } from './schemas/image.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import mongoose from 'mongoose';
import { Readable } from 'stream';

const mockFile = (
  buffer: Buffer = Buffer.from('test'),
): Express.Multer.File => ({
  fieldname: 'file',
  originalname: 'test.png',
  encoding: '7bit',
  mimetype: 'image/png',
  size: buffer.length,
  buffer,
  destination: '',
  filename: '',
  path: '',
  stream: new Readable(),
});

class MockImage {
  constructor(data: any) {
    Object.assign(this, data);
  }
  save = jest.fn().mockResolvedValue(this);
  deleteOne = jest.fn().mockResolvedValue(this);
  toObject() {
    return { ...this };
  }
}

const mockImageData = {
  _id: new mongoose.Types.ObjectId(),
  title: 'Test',
  description: 'Desc',
  data: Buffer.from('test'),
  user: new mongoose.Types.ObjectId(),
};

interface IImageModel {
  find: jest.Mock;
  findOne: jest.Mock;
  findById: jest.Mock;
  findByIdAndUpdate: jest.Mock;
  findByIdAndDelete: jest.Mock;
  countDocuments: jest.Mock;
  (data: any): MockImage;
}

const mockImageConstructor = jest.fn((data: any) => new MockImage(data));
const mockImageModel: IImageModel = Object.assign(mockImageConstructor, {
  find: jest.fn(),
  findOne: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn(),
  countDocuments: jest.fn(),
});

function resetMocks() {
  mockImageConstructor.mockClear();
  mockImageModel.find.mockReset();
  mockImageModel.findOne.mockReset();
  mockImageModel.findById.mockReset();
  mockImageModel.findByIdAndUpdate.mockReset();
  mockImageModel.findByIdAndDelete.mockReset();
  mockImageModel.countDocuments.mockReset();
}

describe('ImageService', () => {
  let service: ImageService;
  let userId: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImageService,
        {
          provide: getModelToken(Image.name),
          useValue: mockImageModel,
        },
      ],
    }).compile();
    service = module.get<ImageService>(ImageService);
    userId = new mongoose.Types.ObjectId().toString();
    resetMocks();
  });

  it('should create an image', async () => {
    mockImageConstructor.mockImplementation(
      (data) => new MockImage({ ...mockImageData, ...data, user: userId }),
    );
    const dto: CreateImageDto = { title: 'Test', description: 'Desc' };
    const file = mockFile();
    const image = await service.create(dto, file, userId);
    expect(image.title).toBe(dto.title);
    expect(image.description).toBe(dto.description);
    expect(image.data).toBeInstanceOf(Buffer);
    expect(image.user).toBe(userId);
  });

  it('should paginate, filter, and order images', async () => {
    const images = Array.from(
      { length: 15 },
      (_, i) =>
        new MockImage({
          ...mockImageData,
          title: `img${String(i + 1).padStart(2, '0')}`,
        }),
    );
    mockImageModel.find.mockReturnValue({
      select: () => ({
        sort: () => ({
          skip: () => ({
            limit: () => ({
              exec: () => images.slice(5, 10),
            }),
          }),
        }),
      }),
    });

    mockImageModel.countDocuments.mockResolvedValue(15);
    const query: QueryImageDto = {
      page: 2,
      limit: 5,
      filter: 'img',
      orderBy: 'title',
      order: 'asc',
    };
    const { data, total } = await service.findAll(query, userId);
    expect(total).toBe(15);
    expect(data.length).toBe(5);
    expect(data[0].title).toBe('img06');
  });

  it('should find one image by id and user', async () => {
    mockImageModel.findById.mockResolvedValue(
      new MockImage({ ...mockImageData, title: 'FindMe', user: userId }),
    );
    const found = await service.findOne(String(mockImageData._id), userId);
    expect(found.title).toBe('FindMe');
  });

  it('should update an image', async () => {
    mockImageModel.findById.mockResolvedValue(
      new MockImage({ ...mockImageData, user: userId }),
    );
    mockImageModel.findByIdAndUpdate.mockResolvedValue(
      new MockImage({ ...mockImageData, title: 'New', user: userId }),
    );
    const updated = await service.update(
      String(mockImageData._id),
      { title: 'New' },
      userId,
    );
    expect(updated.title).toBe('New');
  });

  it('should not allow access to another user', async () => {
    const otherUserId = new mongoose.Types.ObjectId().toString();
    mockImageModel.findById.mockResolvedValue(
      new MockImage({ ...mockImageData, user: userId }),
    );
    await expect(
      service.findOne(String(mockImageData._id), otherUserId),
    ).rejects.toThrow();
    await expect(
      service.update(String(mockImageData._id), { title: 'Hack' }, otherUserId),
    ).rejects.toThrow();
    await expect(
      service.delete(String(mockImageData._id), otherUserId),
    ).rejects.toThrow();
  });
});
