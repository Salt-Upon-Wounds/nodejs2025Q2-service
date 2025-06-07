import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';

@Controller('track')
export class TrackController {
  constructor(private readonly service: TrackService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: CreateTrackDto) {
    console.log('Creating track with DTO:', dto);
    if (!dto.name || dto.duration === undefined) {
      throw new BadRequestException('Missing required fields');
    }
    return this.service.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: CreateTrackDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.remove(id);
  }
}
