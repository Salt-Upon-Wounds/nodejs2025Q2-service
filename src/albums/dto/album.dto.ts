import { IsInt, IsOptional, IsString, IsUUID } from 'class-validator';

export class AlbumDto {
  @IsString()
  name: string;

  @IsInt()
  year: number;

  @IsOptional()
  @IsUUID()
  artistId: string | null;
}
