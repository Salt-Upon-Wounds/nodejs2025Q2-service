import { IsBoolean, IsString } from 'class-validator';

export class ArtistDto {
  @IsString()
  name: string;

  @IsBoolean()
  grammy: boolean;
}
