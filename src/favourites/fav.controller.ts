import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavService } from './fav.service';

@Controller('favs')
export class FavController {
  constructor(private readonly service: FavService) {}

  @Get()
  getAll() {
    return this.service.findAll();
  }

  @Post(':type/:id')
  add(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id') id: string,
  ) {
    return this.service.add(type, id);
  }

  @Delete(':type/:id')
  @HttpCode(204)
  remove(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id') id: string,
  ) {
    return this.service.remove(type, id);
  }
}
