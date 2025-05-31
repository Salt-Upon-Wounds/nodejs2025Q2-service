import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { DB } from 'src/db';

@Injectable()
export class TrackService {
  private tracks: Track[] = DB.tracks;

  findAll() {
    return this.tracks;
  }

  findOne(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const track = this.tracks.find((t) => t.id === id);
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  create(dto: CreateTrackDto) {
    const newTrack: Track = { id: uuidv4(), ...dto };
    this.tracks.push(newTrack);
    return newTrack;
  }

  update(id: string, dto: CreateTrackDto) {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Track not found');
    this.tracks[index] = { ...this.tracks[index], ...dto };
    return this.tracks[index];
  }

  remove(id: string): void {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) throw new NotFoundException('Track not found');

    this.tracks.splice(index, 1);
  }
}
