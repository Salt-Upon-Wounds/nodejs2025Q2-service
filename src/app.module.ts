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
import { LoggingService } from './services/logging.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/jwt.guard';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UserModule,
    TrackModule,
    FavModule,
    ArtistModule,
    AlbumModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    LoggingService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
