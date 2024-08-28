import { Injectable, NotFoundException } from '@nestjs/common';

import { TmdbService } from './tmdb/tmdb.service';
import { FindMovieDto } from './app.dto';
import { AnalysisService } from './analysis/analysis.service';

@Injectable()
export class AppService {
  constructor(
    private readonly tmdbService: TmdbService,
    private readonly analysisService: AnalysisService,
  ) {}

  async findMovie({ query }: FindMovieDto) {
    const movies = await this.tmdbService.search(query);

    if (!movies?.length) {
      throw new NotFoundException();
    }

    const movie = movies[0];

    if (!movie.id) {
      throw new NotFoundException();
    }

    const keywords = await this.tmdbService.findKeywords(movie.id);
    const reviews = await this.tmdbService.findReviews(movie.id);

    const filteredKeywords = keywords.filter((keyword): keyword is string => !!keyword);
    const filteredReviews = reviews
      .filter((review): review is { content: string } => !!review.content)
      .map((review) => review.content);

    const ageRating = await this.analysisService.analyzeAgeRating(filteredKeywords, filteredReviews);

    return {
      id: movie.id,
      title: movie.title,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
      ageRating,
    };
  }
}
