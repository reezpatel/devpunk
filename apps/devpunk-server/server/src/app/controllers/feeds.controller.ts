import {
  Controller,
  Post,
  Req,
  Body,
  Get,
  Query,
  ParseIntPipe
} from '@nestjs/common';
import { DbService } from '../services/db.service';
import { FeedEntry } from '@devpunk/models';
import { APP_CONFIG } from '../config';

const FEEDS_TABLE = DbService.FEEDS_TABLE;

const RPP = Number(APP_CONFIG.RPP);

@Controller('feeds')
export class FeedController {
  constructor(private readonly dbService: DbService) {}

  @Get()
  async getFeeds(
    @Query('page', ParseIntPipe) page: number,
    @Query('site') site: string,
    @Query('query') query: string
  ) {
    const data = await this.dbService.listEntries<FeedEntry>(FEEDS_TABLE, {
      sort: site ? 'site_createdAt' : 'createdAt_site',
      limit: RPP + 1,
      offset: (page - 1) * RPP,
      query,
      range: site
        ? {
            key: 'site_createdAt',
            max: [site, 'MAX'],
            min: [site, 'MIN']
          }
        : {
            key: 'createdAt_site',
            max: ['MAX', 'MAX'],
            min: ['MIN', 'MIN']
          }
    });
    return {
      success: true,
      data: data
        .slice(0, RPP)
        .map(({ createdAt, publishedAt, image, url, ...rest }) => ({
          ...rest,
          time: publishedAt || createdAt
        })),
      meta: {
        hasNext: data.length === RPP + 1
      }
    };
  }
}
