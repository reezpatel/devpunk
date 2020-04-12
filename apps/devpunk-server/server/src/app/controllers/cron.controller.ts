import { Controller, Get, Injectable } from '@nestjs/common';
import { SitesEntry } from '@devpunk/models';

import { DbService } from '../services/db.service';
import { FetchService } from '../services/fetch.service';
import { StorageService } from '../services/storage.service';
import { Cron } from '@nestjs/schedule';
import { Logger } from '../services/logger.service';

const SITES_TABLE = DbService.SITES_TABLE;
const FEEDS_TABLE = DbService.FEEDS_TABLE;

@Injectable()
@Controller('/cron')
export class CronController {
  constructor(
    private readonly dbService: DbService,
    private readonly fetchService: FetchService,
    private readonly storageService: StorageService,
    private readonly logger: Logger
  ) {}

  @Cron('0 0 */6 * *')
  @Get()
  async startCronJob() {
    this.fetchLatestFeeds();
    return {
      success: true,
      message: 'CRON Started'
    };
  }

  private async fetchLatestFeeds() {
    this.logger.log('Starting Batch Job', 'CRON');
    const timeStart = new Date();
    const sites = await this.dbService.listEntries<SitesEntry>(SITES_TABLE, {
      limit: 100000
    });

    const feeds = [];
    for (const site of sites) {
      const start = new Date().getTime();
      this.logger.log(site.name, 'Fetching Feeds...');
      const entries = await this.fetchService.fetchFeedsFrom(site);

      const res = await this.dbService.addEntry(FEEDS_TABLE, entries);
      this.logger.log(site.name, 'Saving Images...');
      await this.storageService.storeFeedImages(res.generated_keys);

      const end = new Date().getTime();
      this.logger.log(
        site.name,
        JSON.stringify({
          status: 'SUCCESS',
          data: {
            count: res?.generated_keys?.length ?? 0,
            time: `${(end - start) / 1000} Sec`
          }
        })
      );

      feeds.push(...entries);
    }

    const timeEnd = new Date();

    this.logger.log(
      'CRON',
      JSON.stringify({
        status: 'SUCCESS',
        data: {
          time: `${(timeEnd.getTime() - timeStart.getTime()) / 1000} Seconds`,
          count: feeds.length
        }
      })
    );
  }
}
