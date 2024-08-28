import { Inject, Injectable } from '@nestjs/common';
import { TwitterApi } from 'twitter-api-v2';

@Injectable()
export class TwitterService {
  private client: TwitterApi;

  constructor(@Inject('X_BEARER_TOKEN') private readonly X_BEARER_TOKEN: string) {
    this.client = new TwitterApi(this.X_BEARER_TOKEN);
  }

  async search(query: string, max: number = 100) {
    const response = await this.client.v2.search(query, {
      'tweet.fields': ['text'],
      max_results: max,
    });

    return response.data.data.map((tweet) => tweet.text);
  }
}
