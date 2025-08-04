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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { ImageService } from './image.service';
import { CreateImageDto } from './dto/create-image.dto';
import { UpdateImageDto } from './dto/update-image.dto';
import { QueryImageDto } from './dto/query-image.dto';
import { Request } from 'express';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

@Controller('images')
@UseGuards(AuthGuard('jwt'))
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() createDto: CreateImageDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.imageService.create(createDto, file, req.user.userId);
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
