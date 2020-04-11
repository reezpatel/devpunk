export interface SitesEntry {
  id: string;
  name: string;
  type: 'RSS' | 'ALGOLIA';
  website: string;
  order: number;
  feed: string;
  active: boolean;
}

export interface FeedEntry {
  url: string;
  website: string;
  title: string;
  source: string;
  createdAt: number;
  publishedAt: number | null;
  author: string;
  image: string;
  id: string;
  tags: string[];
  siteId: string;
}
