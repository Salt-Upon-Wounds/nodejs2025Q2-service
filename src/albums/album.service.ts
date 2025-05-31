import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

@Injectable()
export class AlbumService {
  private albums: Album[] = [];

  findAll() {
    return this.albums;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const album = this.albums.find((u) => u.id === id);
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  create() {}

  remove(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.albums.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Album not found');

    this.albums.splice(index, 1);
  }
}
