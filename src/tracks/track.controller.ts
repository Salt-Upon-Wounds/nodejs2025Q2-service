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
import { TrackService } from './track.service';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

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
