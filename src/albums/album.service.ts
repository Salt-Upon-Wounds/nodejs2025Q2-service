import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Album } from './album.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { AlbumDto } from './dto/album.dto';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    return album;
  }

  async create(dto: AlbumDto): Promise<Album> {
    return this.prisma.album.create({
      data: {
        id: uuidv4(),
        ...dto,
      },
    });
  }

  async update(id: string, dto: AlbumDto): Promise<Album> {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    return this.prisma.album.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw new NotFoundException('Album not found');
    await this.prisma.album.delete({ where: { id } });

    const favorites = await this.prisma.favorites.findMany({
      where: { albums: { has: id } },
    });

    for (const fav of favorites) {
      await this.prisma.favorites.update({
        where: { userId: fav.userId },
        data: {
          albums: fav.albums.filter((albumId) => albumId !== id),
        },
      });
    }
  }
}
