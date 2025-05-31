import { Album } from './albums/album.entity';
import { Artist } from './artists/artist.entity';
import { Favourites } from './favourites/fav.entity';
import { Track } from './tracks/track.entity';
import { User } from './users/user.entity';

export const DB: {
  users: User[];
  favourites: Favourites[];
  tracks: Track[];
  artists: Artist[];
  albums: Album[];
} = {
  users: [],
  favourites: [],
  tracks: [],
  artists: [],
  albums: [],
};
