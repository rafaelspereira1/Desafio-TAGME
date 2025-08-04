import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User, UserSchema } from './schemas/user.schema';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let mongod: MongoMemoryServer;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot(uri),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
      ],
      providers: [UserService],
    }).compile();
    service = module.get<UserService>(UserService);
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

  it('should create a user', async () => {
    const user = await service.create({
      email: 'test@example.com',
      password: 'password',
    });
    expect(user.email).toBe('test@example.com');
    expect(user.password).not.toBe('password'); // Should be hashed
  });

  it('should find user by email', async () => {
    await service.create({
      email: 'findme@example.com',
      password: 'password',
    });
    const user = await service.findByEmail('findme@example.com');
    expect(user).not.toBeNull();
    expect(user?.email).toBe('findme@example.com');
  });

  it('should validate user credentials', async () => {
    await service.create({
      email: 'login@example.com',
      password: 'password',
    });
    const valid = await service.validateUser({
      email: 'login@example.com',
      password: 'password',
    });
    expect(valid).not.toBeNull();
    const invalid = await service.validateUser({
      email: 'login@example.com',
      password: 'wrong',
    });
    expect(invalid).toBeNull();
  });

  it('should update user password', async () => {
    const user = await service.create({
      email: 'update@example.com',
      password: 'password',
    });
    const updated = await service.update(String(user._id), {
      password: 'newpassword',
    });
    expect(updated).not.toBeNull();
    expect(updated?.password).not.toBe(user.password);
    const valid = await service.validateUser({
      email: 'update@example.com',
      password: 'newpassword',
    });
    expect(valid).not.toBeNull();
  });

  it('should delete a user', async () => {
    const user = await service.create({
      email: 'delete@example.com',
      password: 'password',
    });
    const deleted = await service.delete(String(user._id));
    expect(deleted).not.toBeNull();
    const found = await service.findByEmail('delete@example.com');
    expect(found).toBeNull();
  });
});
