import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { ArtistDto } from './dto/artist.dto';
import { DB } from 'src/db';

@Injectable()
export class ArtistService {
  private artists: Artist[] = DB.artists;

  findAll() {
    console.log('Fetching all artists');
    return this.artists;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const artist = this.artists.find((a) => a.id === id);
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  create(dto: ArtistDto) {
    const artist: Artist = {
      id: uuidv4(),
      ...dto,
    };
    this.artists.push(artist);
    return artist;
  }

  update(id: string, dto: ArtistDto) {
    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');

    const updated = { ...this.artists[index], ...dto };
    this.artists[index] = updated;
    return updated;
  }

  remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.artists.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Artist not found');

    this.artists.splice(index, 1);

    for (const track of DB.tracks) {
      if (track.artistId === id) {
        track.artistId = null;
      }
    }

    for (const album of DB.albums) {
      if (album.artistId === id) {
        album.artistId = null;
      }
    }
  }
}
