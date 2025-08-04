import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import type { Request, Response } from 'express';
import { Types } from 'mongoose';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

interface ImageResponse {
  _id: string | Types.ObjectId;
  title: string;
  description?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

@Controller('images')
@UseGuards(AuthGuard('jwt'))
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get(':id/file')
  async serveImageFile(
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Res() res: Response,
  ) {
    const image = await this.imageService.findOne(id, req.user.userId);
    res.setHeader('Content-Type', 'image/png'); // You may want to set this dynamically
    res.send(image.data);
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    const image = await this.imageService.create(
      createDto,
      file,
      req.user.userId,
    );
    const imgObj = image.toObject() as ImageResponse;
    return {
      id: String(imgObj._id),
      title: imgObj.title,
      description: imgObj.description,
      url: `/images/${String(imgObj._id)}/file`,
      createdAt:
        imgObj.createdAt instanceof Date
          ? imgObj.createdAt.toISOString()
          : String(imgObj.createdAt),
      updatedAt:
        imgObj.updatedAt instanceof Date
          ? imgObj.updatedAt.toISOString()
          : String(imgObj.updatedAt),
    };
  }

  @Get()
  async findAll(
    @Query() query: QueryImageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.imageService.findAll(query, req.user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.imageService.findOne(id, req.user.userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateImageDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.imageService.update(id, updateDto, req.user.userId);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Req() req: AuthenticatedRequest) {
    return this.imageService.delete(id, req.user.userId);
  }
}
