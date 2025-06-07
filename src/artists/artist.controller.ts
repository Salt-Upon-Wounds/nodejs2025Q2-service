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
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { ArtistDto } from './dto/artist.dto';

@Controller('artist')
export class ArtistController {
  constructor(private readonly service: ArtistService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async getOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.service.findOne(id);
  }

  @Post()
  async create(@Body() dto: ArtistDto) {
    return this.service.create(dto);
  }

  @Put(':id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: ArtistDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  async remove(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.service.remove(id);
  }
}
