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
import { FavService } from './fav.service';

@Controller('favs')
export class FavController {
  constructor(private readonly favService: FavService) {}

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
