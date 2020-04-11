import {
  Controller,
  Post,
  Body,
  ParseArrayPipe,
  Get,
  Put,
  Param
} from '@nestjs/common';
import { DbService } from '../services/db.service';
import { SiteRequest } from '../shapes/site.request';
import { SitesEntry } from '@devpunk/models';
import { StorageService } from '../services/storage.service';

const SITES_TABLE = DbService.SITES_TABLE;

@Controller('sites')
export class SitesController {
  constructor(
    private readonly dbService: DbService,
    private readonly storageService: StorageService
  ) {}

  @Post()
  async addSite(
    @Body(
      new ParseArrayPipe({
        items: SiteRequest,
        forbidNonWhitelisted: true,
        whitelist: true
      })
    )
    siteEntries: SiteRequest[]
  ) {
    for (const entry of siteEntries) {
      const data = await this.dbService.getEntryFor(
        SITES_TABLE,
        'feed',
        entry.feed
      );

      if (data.length !== 0) {
        return {
          status: 409,
          error: 'Conflict',
          message: `${entry.name} Has duplicate entry`
        };
      }
    }

    const res = await this.dbService.addEntry(SITES_TABLE, siteEntries);
    await this.storageService.storeSiteImages(res.generated_keys);

    return {
      status: 200,
      data: res.generated_keys
    };
  }

  @Get()
  async getSites() {
    const data = await this.dbService.listEntries<SitesEntry>(SITES_TABLE, {
      sort: 'order'
    });
    return {
      success: true,
      data
    };
  }

  @Put('/:id')
  async updateSite(@Body() entry: SiteRequest, @Param('id') id: string) {
    const data = await this.dbService.updateEntry(SITES_TABLE, id, entry);
    await this.storageService.storeSiteImages(data.generated_keys);
    return {
      success: true,
      data
    };
  }
}
