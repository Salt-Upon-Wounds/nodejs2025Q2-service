import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { validate as isUuid } from 'uuid';
import { DB } from 'src/db';

@Injectable()
export class FavService {
  private favs = DB.favourites;

  findAll() {
    return {
      albums: this.favs.albums.map((albumId) =>
        DB.albums.find((el) => el.id === albumId),
      ),
      artists: this.favs.artists.map((artistId) =>
        DB.artists.find((el) => el.id === artistId),
      ),
      tracks: this.favs.tracks.map((trackId) =>
        DB.tracks.find((el) => el.id === trackId),
      ),
    };
  }

  add(type: 'artist' | 'album' | 'track', id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const entityList = DB[`${type}s`] as { id: string }[];
    const entity = entityList.find((e) => e.id === id);
    if (!entity) throw new UnprocessableEntityException(`${type} not found`);

    const favList = DB.favourites[`${type}s`] as string[];
    if (!favList.includes(id)) favList.push(id);
  }

  remove(type: 'artist' | 'album' | 'track', id: string) {
    if (!isUuid(id)) throw new BadRequestException('Invalid UUID');

    const favList = DB.favourites[`${type}s`] as string[];
    const index = favList.indexOf(id);
    if (index === -1) throw new NotFoundException(`${type} not in favorites`);

    favList.splice(index, 1);
  }
}
