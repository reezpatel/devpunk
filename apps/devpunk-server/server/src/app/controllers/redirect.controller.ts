import { DbService } from '../services/db.service';
import { Controller, Get, Param, Redirect } from '@nestjs/common';
import { FeedEntry } from '@devpunk/models';

const FEEDS_TABLE = DbService.FEEDS_TABLE;

@Controller('r')
export class RedirectController {
  constructor(private readonly dbService: DbService) {}

  @Get('/:id')
  @Redirect('https://www.devpunk.xyz', 302)
  async redirectToFeed(@Param('id') id: string) {
    const feed = await this.dbService.getEntryById<FeedEntry>(FEEDS_TABLE, id);

    if (feed) {
      return {
        url: feed.url.startsWith('/') ? `${feed.source}${feed.url}` : feed.url
      };
    }
  }
}
