import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class FindMovieDto {
  @ApiProperty({ description: '검색어', required: true, example: '' })
  @IsString()
  query: string;
}
