import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { User } from 'src/users/user.entity';
import { validate as isUuid } from 'uuid';

@Injectable()
export class FavService {
  private user: User | null;
  private tmpUserId = 'tmp';
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const fav = await this.prisma.favorites.findUnique({
      where: { userId: this.tmpUserId },
    });
    if (!fav) {
      return { artists: [], albums: [], tracks: [] };
    }

    const [artists, albums, tracks] = await Promise.all([
      this.prisma.artist.findMany({ where: { id: { in: fav.artists } } }),
      this.prisma.album.findMany({ where: { id: { in: fav.albums } } }),
      this.prisma.track.findMany({ where: { id: { in: fav.tracks } } }),
    ]);

    return { artists, albums, tracks };
  }

  async add(type: 'artist' | 'album' | 'track', id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    this.user = await this.prisma.user.findUnique({
      where: { id: this.tmpUserId },
    });
    if (!this.user) {
      this.user = await this.prisma.user.create({
        data: {
          id: this.tmpUserId,
          login: 'tmp',
          password: 'tmp',
          version: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }

    let entity = null;
    if (type === 'artist') {
      entity = await this.prisma.artist.findUnique({ where: { id } });
    } else if (type === 'album') {
      entity = await this.prisma.album.findUnique({ where: { id } });
    } else if (type === 'track') {
      entity = await this.prisma.track.findUnique({ where: { id } });
    }
    if (!entity) throw new UnprocessableEntityException(`${type} not found`);

    let fav = await this.prisma.favorites.findUnique({
      where: { userId: this.tmpUserId },
    });
    if (!fav) {
      fav = await this.prisma.favorites.create({
        data: { userId: this.tmpUserId, artists: [], albums: [], tracks: [] },
      });
    }

    const list = fav[`${type}s`] as string[];
    if (!list.includes(id)) {
      list.push(id);
      await this.prisma.favorites.update({
        where: { userId: this.tmpUserId },
        data: { [`${type}s`]: list },
      });
    }
  }

  async remove(type: 'artist' | 'album' | 'track', id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const fav = await this.prisma.favorites.findUnique({
      where: { userId: this.tmpUserId },
    });
    if (!fav) throw new NotFoundException('Favorites not found');

    const list = fav[`${type}s`] as string[];
    if (!list.includes(id))
      throw new NotFoundException(`${type} not in favorites`);

    const newList = list.filter((itemId) => itemId !== id);
    await this.prisma.favorites.update({
      where: { userId: this.tmpUserId },
      data: { [`${type}s`]: newList },
    });
  }
}
