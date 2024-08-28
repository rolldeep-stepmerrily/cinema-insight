import { Inject, Injectable } from '@nestjs/common';
import * as natural from 'natural';
import { LanguageServiceClient } from '@google-cloud/language';
import * as fs from 'fs';
import Sentiment from 'sentiment';

@Injectable()
export class AnalysisService {
  private sentiment: Sentiment;
  private languageClient: LanguageServiceClient;

  constructor(@Inject('GOOGLE_SERVICE_CREDENTIALS') private readonly GOOGLE_SERVICE_CREDENTIALS: string) {
    this.sentiment = new Sentiment();

    const credentials = JSON.parse(fs.readFileSync(this.GOOGLE_SERVICE_CREDENTIALS, 'utf8'));

    this.languageClient = new LanguageServiceClient({ credentials });
  }

  async analyzeAgeRating(keywords: string[], reviews: string[]) {
    const keywordScore = await this.analyzeKeywords(keywords);
    const reviewScore = await this.analyzeReviews(reviews);

    const score = (keywordScore + reviewScore) / 2;

    return this.mappingAgeRating(score);
  }

  async analyzeKeywords(keywords: string[]) {
    const adultKeywords = ['violence', 'sex', 'drug', 'alcohol', 'crime', 'death', 'war', 'horror'];
    const teenKeywords = ['romance', 'drama', 'thriller', 'suspense'];
    const childKeywords = ['family', 'animation', 'adventure', 'fantasy', 'comedy', 'musical', 'kids'];

    const tokenizer = new natural.WordTokenizer();
    let adultScore = 0;
    let teenScore = 0;
    let childScore = 0;

    keywords.forEach((keyword) => {
      const tokens = tokenizer.tokenize(keyword.toLowerCase());

      tokens.forEach((token) => {
        if (adultKeywords.includes(token)) {
          adultScore++;
        }

        if (teenKeywords.includes(token)) {
          teenScore++;
        }

        if (childKeywords.includes(token)) {
          childScore++;
        }
      });
    });

    const totalScore = adultScore + teenScore + childScore;

    if (!totalScore) {
      return 0.5;
    }
    return (adultScore * 1 + teenScore * 0.5) / totalScore;
  }

  async analyzeReviews(reviews: string[]) {
    const sentimentScores = reviews.map((review) => this.sentiment.analyze(review).score);

    const averageSentiment =
      sentimentScores.reduce((acc: number, cur: number) => {
        return acc + cur;
      }, 0) / sentimentScores.length;

    const contentScores = await Promise.all(reviews.map((review) => this.analyzeContentSafety(review)));

    const averageContentScore =
      contentScores.reduce((acc: number, cur: number) => {
        return acc + cur;
      }, 0) / contentScores.length;

    if (isNaN(averageSentiment) || isNaN(averageContentScore)) {
      return 0;
    }

    const normalizedSentiment = (averageSentiment + 5) / 10;

    return (1 - normalizedSentiment) * 0.3 + averageContentScore * 0.7;
  }

  async analyzeContentSafety(text: string) {
    const [result] = await this.languageClient.analyzeSentiment({ document: { content: text, type: 'PLAIN_TEXT' } });

    const sentiment = result.documentSentiment;

    if (!sentiment?.score) {
      return 0;
    }

    return 1 - (sentiment.score + 1) / 2;
  }

  async mappingAgeRating(score: number) {
    if (score < 0.2) {
      return 0;
    }

    if (score < 0.4) {
      return 7;
    }

    if (score < 0.6) {
      return 12;
    }

    if (score < 0.8) {
      return 15;
    }

    return 18;
  }
}
