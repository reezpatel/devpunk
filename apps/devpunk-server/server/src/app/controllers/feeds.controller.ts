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
  async getFeeds(@Query('page', ParseIntPipe) page: number) {
    const data = await this.dbService.listEntries<FeedEntry>(FEEDS_TABLE, {
      sort: 'order',
      limit: RPP + 1,
      offset: (page - 1) * RPP
    });
    return {
      success: true,
      data: data.slice(0, RPP),
      meta: {
        hasNext: data.length === RPP + 1
      }
    };
  }
}
