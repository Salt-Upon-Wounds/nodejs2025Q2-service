import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Artist } from './artist.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { ArtistDto } from './dto/artist.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ArtistService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    return artist;
  }

  async create(dto: ArtistDto): Promise<Artist> {
    return this.prisma.artist.create({
      data: {
        id: uuidv4(),
        name: dto.name,
        grammy: dto.grammy,
      },
    });
  }

  async update(id: string, dto: ArtistDto): Promise<Artist> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    return this.prisma.artist.update({
      where: { id },
      data: {
        name: dto.name,
        grammy: dto.grammy,
      },
    });
  }

  async remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw new NotFoundException('Artist not found');
    await this.prisma.artist.delete({ where: { id } });

    const favorites = await this.prisma.favorites.findMany({
      where: { artists: { has: id } },
    });

    for (const fav of favorites) {
      await this.prisma.favorites.update({
        where: { userId: fav.userId },
        data: {
          artists: fav.artists.filter((artistId) => artistId !== id),
        },
      });
    }
  }
}
