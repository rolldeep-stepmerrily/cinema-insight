import { Injectable, NotFoundException } from '@nestjs/common';

import { TmdbService } from './tmdb/tmdb.service';
import { FindMovieDto } from './app.dto';

@Injectable()
export class AppService {
  constructor(private readonly tmdbService: TmdbService) {}

  async findMovie({ query }: FindMovieDto) {
    const movies = await this.tmdbService.search(query);

    if (!movies?.length) {
      throw new NotFoundException();
    }

    const movie = movies[0];

    if (!movie.id) {
      throw new NotFoundException();
    }
  }
}
