import { mkdirSync, existsSync, createWriteStream } from 'fs';
import { join } from 'path';
import { APP_CONFIG } from '../config';
import { SitesEntry, FeedEntry } from '@devpunk/models';
import axios from 'axios';
import { DbService } from './db.service';
import { Inject } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

const SITES_TABLE = DbService.SITES_TABLE;
const FEEDS_TABLE = DbService.FEEDS_TABLE;
const { DATA_PATH, DATA_FOLDER } = APP_CONFIG;

const STATIC_PATH = join(DATA_PATH, DATA_FOLDER);
const FEEDS_PATH = join(DATA_PATH, DATA_FOLDER, 'feeds');
const SITES_PATH = join(DATA_PATH, DATA_FOLDER, 'sites');

export class StorageService {
  constructor(
    @Inject('DbService') private readonly dbService: DbService,
    @Inject('Logger') private readonly logger: Logger
  ) {
    if (!existsSync(DATA_PATH)) {
      this.logger.error(
        '[STORAGE]',
        `${DATA_PATH} Doesn't Exist... Exiting!!!`
      );
      process.exit(0);
    }

    [STATIC_PATH, FEEDS_PATH, SITES_PATH].forEach(path => {
      if (!existsSync(path)) {
        mkdirSync(path);
      }
    });
  }

  storeFeedImages(ids: string[] = []) {
    const _promises = ids.map(async id => {
      const path = join(FEEDS_PATH, id);
      const feed = await this.dbService.getEntryById<FeedEntry>(
        FEEDS_TABLE,
        id
      );

      if (!existsSync(path) && feed.image) {
        try {
          const res = await axios.get(feed.image, {
            responseType: 'stream'
          });
          if (res.status === 200) {
            res.data.pipe(createWriteStream(path));
          }
        } catch (e) {
          this.logger.error('[STORAGE]', `{${feed.image}}`, e.message);
        }
      }
    });

    return Promise.all(_promises);
  }

  async storeSiteImages(ids: string[]) {
    const _promises = ids.map(async id => {
      const path = join(SITES_PATH, id);
      const site = await this.dbService.getEntryById<SitesEntry>(
        SITES_TABLE,
        id
      );

      let imageURL = '';

      if (!existsSync(path)) {
        try {
          const domain = new URL(site.website).hostname;
          const url = `http://favicongrabber.com/api/grab/${domain}`;

          const response = (await axios.get(url)).data;
          imageURL = response?.icons?.[0]?.src ?? '';

          (response?.icons ?? []).forEach(
            (data: { src: string; sizes?: string }) => {
              if (data.sizes && Number(data.sizes.split('x')[0]) > 120) {
                imageURL = data.src;
              }
            }
          );

          const res = await axios.get(imageURL, {
            responseType: 'stream'
          });
          if (res.status === 200) {
            res.data.pipe(createWriteStream(path));
          }
        } catch (e) {
          this.logger.error('[STORAGE]', `{${imageURL}}`, e.message);
        }
      }
    });

    return Promise.all(_promises);
  }
}
