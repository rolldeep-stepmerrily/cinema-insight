import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';
import { FindMovieDto } from './app.dto';

@ApiTags()
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: '영화 검색' })
  @Get()
  async findMovie(@Query() findMovieDto: FindMovieDto) {
    return await this.appService.findMovie(findMovieDto);
  }
}
