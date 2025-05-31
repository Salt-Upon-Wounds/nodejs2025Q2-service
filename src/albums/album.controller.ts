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
import { AlbumService } from './album.service';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

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
