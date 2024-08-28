import { Inject, Injectable } from '@nestjs/common';
import { MovieDb } from 'moviedb-promise';

@Injectable()
export class TmdbService {
  private movieDb: MovieDb;

  constructor(@Inject('TMDB_API_KEY') private readonly TMDB_API_KEY: string) {
    this.movieDb = new MovieDb(this.TMDB_API_KEY);
  }

  async search(query: string) {
    const response = await this.movieDb.searchMovie({ query });

    return response.results;
  }

  async findKeywords(movieId: number) {
    const response = await this.movieDb.movieKeywords({ id: movieId });

    if (!response.keywords) {
      return [];
    }

    return response.keywords.map((keyword) => keyword.name);
  }

  async findReviews(movieId: number) {
    const response = await this.movieDb.movieReviews({ id: movieId });

    if (!response.results) {
      return [];
    }

    return response.results;
  }
}
