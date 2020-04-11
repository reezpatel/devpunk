import { Inject, Injectable } from '@nestjs/common';
import { DbService } from './db.service';
import { FetchService } from './fetch.service';
import { SitesEntry } from '@devpunk/models';
import { StorageService } from './storage.service';
import { Cron } from '@nestjs/schedule';
import { Logger } from 'pino';

const SITES_TABLE = DbService.SITES_TABLE;
const FEEDS_TABLE = DbService.FEEDS_TABLE;

@Injectable()
export class CronService {
  constructor(
    private readonly dbService: DbService,
    private readonly fetchService: FetchService,
    private readonly storageService: StorageService,
    @Inject('Logger') private readonly logger: Logger
  ) {}

  @Cron('55 47 */3 * * *')
  async fetchLatestFeeds() {
    this.logger.log('[CRON]', 'Starting Batch Job');
    const timeStart = new Date();
    const sites = await this.dbService.listEntries<SitesEntry>(SITES_TABLE, {
      limit: 100000
    });

    const feeds = [];
    for (const site of sites) {
      const start = new Date().getTime();
      this.logger.log(`[${site.name}]`, 'Fetching Feeds...');
      const entries = await this.fetchService.fetchFeedsFrom(site);

      const res = await this.dbService.addEntry(FEEDS_TABLE, entries);
      this.logger.log(`[${site.name}]`, 'Saving Images...');
      await this.storageService.storeFeedImages(res.generated_keys);

      const end = new Date().getTime();
      this.logger.log(`[${site.name}]`, {
        status: 'SUCCESS',
        data: {
          count: res?.generated_keys?.length ?? 0,
          time: `${(end - start) / 1000} Sec`
        }
      });

      feeds.push(...entries);
    }

    const timeEnd = new Date();

    this.logger.info('[CRON]', {
      status: 'SUCCESS',
      data: {
        time: `${(timeEnd.getTime() - timeStart.getTime()) / 1000} Seconds`,
        count: feeds.length
      }
    });
  }
}
