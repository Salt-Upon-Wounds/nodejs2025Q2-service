import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { AlbumDto } from './dto/album.dto';
import { DB } from 'src/db';

@Injectable()
export class AlbumService {
  private albums = DB.albums;

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const album = this.albums.find((u) => u.id === id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  create(dto: AlbumDto) {
    const album: Album = {
      id: uuidv4(),
      ...dto,
    };
    this.albums.push(album);
    return album;
  }

  update(id: string, dto: AlbumDto) {
    const index = this.albums.findIndex((a) => a.id === id);
    if (index === -1) throw new NotFoundException('Album not found');
    const updated = { ...this.albums[index], ...dto };
    this.albums[index] = updated;
    return updated;
  }

  remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.albums.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Album not found');

    this.albums.splice(index, 1);

    for (const track of DB.tracks) {
      if (track.albumId === id) {
        track.albumId = null;
      }
    }

    const favIndex = DB.favourites.albums.indexOf(id);
    if (favIndex !== -1) {
      DB.favourites.albums.splice(favIndex, 1);
    }
  }
}
