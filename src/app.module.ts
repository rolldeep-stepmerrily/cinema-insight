import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

import { ConfigProviderModule } from './common/config-provider/config-provider.module';
import { HttpLoggerMiddleware } from './common/middlewares';
import { TmdbModule } from './tmdb/tmdb.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        SERVER_URL: Joi.string().required(),
        NODE_ENV: Joi.string().required(),
        PORT: Joi.number().default(3070),
        TMDB_API_KEY: Joi.string().required(),
        TMDB_API_ACCESS_KEY: Joi.string().required(),
        GOOGLE_SERVICE_CREDENTIALS: Joi.string().required(),
        GUEST_NAME: Joi.string().required(),
        GUEST_PASSWORD: Joi.string().required(),
      }),
      envFilePath: '.env',
      isGlobal: true,
      validationOptions: { abortEarly: true },
    }),
    ConfigProviderModule,
    TmdbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggerMiddleware).forRoutes('*');
  }
}
