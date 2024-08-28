import { ConfigService } from '@nestjs/config';

const createConfigProvider = <T>(key: string, type: 'string' | 'number' = 'string') => {
  return {
    provide: key,
    useFactory: (configService: ConfigService) => {
      const value = configService.getOrThrow<T>(key);
      return type === 'number' ? Number(value) : value;
    },
    inject: [ConfigService],
  };
};

export const SERVER_URL = createConfigProvider<string>('SERVER_URL');
export const NODE_ENV = createConfigProvider<string>('NODE_ENV');
export const PORT = createConfigProvider<number>('PORT', 'number');
export const TMDB_API_KEY = createConfigProvider<string>('TMDB_API_KEY');
export const TMDB_API_ACCESS_KEY = createConfigProvider<string>('TMDB_API_ACCESS_KEY');
export const GOOGLE_SERVICE_CREDENTIALS = createConfigProvider<string>('GOOGLE_SERVICE_CREDENTIALS');
export const GUEST_NAME = createConfigProvider<string>('GUEST_NAME');
export const GUEST_PASSWORD = createConfigProvider<string>('GUEST_PASSWORD');
