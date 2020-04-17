import { SitesResponse, FeedResponse } from '@devpunk/models';
import { storage } from './storage';
const DOMAIN = 'https://api.devpunk.xyz/v1';
const SITES_URL = `${DOMAIN}/sites`;
const PAGES_URL = (page = 1, query = '') =>
  `${DOMAIN}/feeds?page=${page}&query=${query}`;
const PAGES_URL_WITH_SITE = (page = 1, site = '', query = '') =>
  `${DOMAIN}/feeds?page=${page}&site=${site}&query=${query}`;

interface SiteHttpResponse {
  success: boolean;
  data: SitesResponse[];
}

const http = {
  getSites: async (): Promise<SiteHttpResponse> => {
    return fetch(SITES_URL).then(r => r.json());
  },
  getFeeds: async (
    page,
    site,
    query
  ): Promise<{ data: FeedResponse[]; meta: { hasNext: boolean } }> => {
    switch (site) {
      case 'ALL': {
        return fetch(PAGES_URL(page)).then(r => r.json());
      }
      case 'PINNED': {
        return { data: storage.listLikedFeed(), meta: { hasNext: false } };
      }
      default: {
        return fetch(PAGES_URL_WITH_SITE(page, site, query)).then(r =>
          r.json()
        );
      }
    }
  },
  getFeedBanner: id => `${DOMAIN}/static/feeds/${id}`,
  getFeedUrl: id => `${DOMAIN}/r/${id}`
};

export { http };
