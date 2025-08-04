import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Readable } from 'stream';
import { ImageService } from './image.service';
import { Image, ImageSchema } from './schemas/image.schema';
import { CreateImageDto } from './dto/create-image.dto';
import { QueryImageDto } from './dto/query-image.dto';

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

describe('ImageService', () => {
  let service: ImageService;
  let mongod: MongoMemoryServer;
  let userId: string;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
      ],
      providers: [ImageService],
    }).compile();
    service = module.get<ImageService>(ImageService);
    userId = new mongoose.Types.ObjectId().toString();
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongod.stop();
  });

  afterEach(async () => {
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase();
    }
  });

  it('should create an image', async () => {
    const dto: CreateImageDto = { title: 'Test', description: 'Desc' };
    const file = mockFile();
    const image = await service.create(dto, file, userId);
    expect(image.title).toBe(dto.title);
    expect(image.description).toBe(dto.description);
    expect(image.data).toBeInstanceOf(Buffer);
    expect(image.user.toString()).toBe(userId);
  });

  it('should paginate, filter, and order images', async () => {
    for (let i = 1; i <= 15; i++) {
      await service.create({ title: `img${i}` }, mockFile(), userId);
    }
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
    expect(data[0].title).toBe('img6');
  });

  it('should find one image by id and user', async () => {
    const image = await service.create({ title: 'FindMe' }, mockFile(), userId);
    const found = await service.findOne(String(image._id), userId);
    expect(found.title).toBe('FindMe');
  });

  it('should update an image', async () => {
    const image = await service.create({ title: 'Old' }, mockFile(), userId);
    const updated = await service.update(
      String(image._id),
      { title: 'New' },
      userId,
    );
    expect(updated.title).toBe('New');
  });

  it('should delete an image', async () => {
    const image = await service.create(
      { title: 'ToDelete' },
      mockFile(),
      userId,
    );
    const deleted = await service.delete(String(image._id), userId);
    expect(deleted.title).toBe('ToDelete');
    await expect(service.findOne(String(image._id), userId)).rejects.toThrow();
  });

  it('should not allow access to another user', async () => {
    const image = await service.create(
      { title: 'Private' },
      mockFile(),
      userId,
    );
    const otherUserId = new mongoose.Types.ObjectId().toString();
    await expect(
      service.findOne(String(image._id), otherUserId),
    ).rejects.toThrow();
    await expect(
      service.update(String(image._id), { title: 'Hack' }, otherUserId),
    ).rejects.toThrow();
    await expect(
      service.delete(String(image._id), otherUserId),
    ).rejects.toThrow();
  });
});
