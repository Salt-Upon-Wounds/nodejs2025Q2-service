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

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAll() {}

  @Get(':id')
  getOne(@Param('id', new ParseUUIDPipe()) id: string) {}

  @Post()
  create() {}

  @Put(':id')
  update(@Param('id', new ParseUUIDPipe()) id: string) {}

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe()) id: string) {}
}
