import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Track } from './track.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateTrackDto } from './dto/create-track.dto';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class TrackService {
  constructor(private prisma: PrismaService) {}
  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    return this.prisma.track.create({
      data: {
        id: uuidv4(),
        ...dto,
      },
    });
  }

  async update(id: string, dto: CreateTrackDto): Promise<Track> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    return this.prisma.track.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw new NotFoundException('Track not found');
    await this.prisma.track.delete({ where: { id } });

    const favorites = await this.prisma.favorites.findMany({
      where: { tracks: { has: id } },
    });

    for (const fav of favorites) {
      await this.prisma.favorites.update({
        where: { userId: fav.userId },
        data: {
          tracks: fav.tracks.filter((trackId) => trackId !== id),
        },
      });
    }
  }
}
