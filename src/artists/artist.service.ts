import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [];

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const artist = this.artists.find((u) => u.id === id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  create() {}

  remove(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.artists.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');

    this.artists.splice(index, 1);
  }
}
