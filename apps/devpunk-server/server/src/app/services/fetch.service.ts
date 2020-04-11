import { SitesEntry } from '@devpunk/models';
import { RssService } from './rss.service';
import { Inject } from '@nestjs/common';

export class FetchService {
  constructor(@Inject('RssService') private readonly rssService: RssService) {}

  async fetchFeedsFrom(site: SitesEntry) {
    const meta = {
      website: site.website,
      source: site.name,
      siteId: site.id
    };

    const feeds = await this.rssService.parse(meta, site.feed);

    return feeds;
  }
}
