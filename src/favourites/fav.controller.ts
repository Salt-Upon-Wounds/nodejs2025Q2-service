import { Controller, Get, Post, Delete, Param, HttpCode } from '@nestjs/common';
import { FavService } from './fav.service';

@Controller('favs')
export class FavController {
  constructor(private readonly service: FavService) {}

  @Get()
  async getAll() {
    return this.service.findAll();
  }

  @Post(':type/:id')
  async add(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id') id: string,
  ) {
    return this.service.add(type, id);
  }

  @Delete(':type/:id')
  @HttpCode(204)
  async remove(
    @Param('type') type: 'artist' | 'album' | 'track',
    @Param('id') id: string,
  ) {
    await this.service.remove(type, id);
  }
}
