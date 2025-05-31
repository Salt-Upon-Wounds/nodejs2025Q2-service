import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

@Injectable()
export class TrackService {
  private tracks: Track[] = [];

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const track = this.tracks.find((u) => u.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  create() {}

  remove(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.tracks.findIndex((u) => u.id === id);
    if (index === -1) throw new NotFoundException('Track not found');

    this.tracks.splice(index, 1);
  }
}
