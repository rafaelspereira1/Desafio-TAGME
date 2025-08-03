import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [MongooseModule.forRoot('mongodb://mongodb:27017/tagme')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
