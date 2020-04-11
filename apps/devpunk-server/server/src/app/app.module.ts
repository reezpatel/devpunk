import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { DbService } from './services/db.service';
import { FeedController } from './controllers/feeds.controller';
import { SitesController } from './controllers/sites.controller';
import { FetchService } from './services/fetch.service';
import { RssService } from './services/rss.service';
import { StorageService } from './services/storage.service';
import { StaticController } from './controllers/static.controller';
import { LoggerModule } from 'nestjs-pino';
import { CronController } from './controllers/cron.controller';

@Module({
  imports: [ScheduleModule.forRoot(), LoggerModule.forRoot()],
  controllers: [
    AppController,
    FeedController,
    SitesController,
    StaticController,
    CronController
  ],
  providers: [DbService, RssService, FetchService, StorageService]
})
export class AppModule {}
