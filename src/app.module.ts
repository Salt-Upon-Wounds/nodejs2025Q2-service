import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/user.module';
import { ConfigModule } from '@nestjs/config';
import { TrackModule } from './tracks/track.module';
import { FavModule } from './favourites/fav.module';
import { ArtistModule } from './artists/artist.module';
import { AlbumModule } from './albums/album.module';
import { PrismaService } from './services/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TrackModule,
    FavModule,
    ArtistModule,
    AlbumModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
