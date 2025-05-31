import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { Favourites } from './fav.entity';
import { v4 as uuidv4, validate as isUuid } from 'uuid';

@Injectable()
export class FavService {
  private favs: Favourites[] = [];

  findAll() {
    return this.favs;
  }

  create() {}

  remove(id: string) {}
}
