import * as RSSParser from 'rss-parser';
import { Inject } from '@nestjs/common';
import { DbService } from './db.service';
import axios from 'axios';
import cheerio from 'cheerio';

const FEEDS_TABLE = DbService.FEEDS_TABLE;

export class RssService {
  parser: RSSParser;
  constructor(@Inject('DbService') private readonly dbService: DbService) {
    this.parser = new RSSParser({
      headers: {
        Accept: 'application/rss+xml, application/xml'
      }
    });
  }

  private getAuthor(data: string | { name: string[] }) {
    return typeof data === 'object' ? data.name[0] : data;
  }

  private async fetchFeedImageFrom(website, url) {
    if (url === '') {
      return '';
    }

    try {
      const response = (await axios.get(url, { timeout: 1000 * 60 * 2 })).data;

      const $ = cheerio.load(response);
      const e = $('head meta[property="og:image"]');

      const imageUrl: string = e.prop('content') || '';

      return imageUrl.startsWith('/') ? `${website}${imageUrl}` : imageUrl;
    } catch (e) {
      return '';
    }
  }

  private async mapFeeds(meta: any, feed: RSSParser.Item) {
    const link = feed.link;
    const entry = await this.dbService.getEntryFor(FEEDS_TABLE, 'url', link);

    if (entry.length === 0) {
      return {
        url: link,
        createdAt: new Date().getTime(),
        author: this.getAuthor(feed.creator ?? ''),
        title: feed.title ?? '',
        publishedAt: feed.pubDate ? new Date(feed.pubDate).getTime() : null,
        image: await this.fetchFeedImageFrom(meta.website ?? '', link),
        tags: feed.categories ?? [],
        ...meta
      };
    }
  }

  async parse(meta: any, url: string) {
    const data = await this.parser.parseURL(url);
    const feeds = [];
    for (const entry of data.items) {
      const feed = await this.mapFeeds(meta, entry);
      if (feed) {
        console.log('here');
        feeds.push(feed);
      }
    }
    return feeds;
  }
}