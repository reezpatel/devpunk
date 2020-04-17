import { FeedResponse } from '@devpunk/models';

const storage = {
  listLikedFeed: (): FeedResponse[] => {
    const feeds = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('FEED')) {
        feeds.push(JSON.parse(localStorage.getItem(key)));
      }
    }
    return feeds;
  },
  likeFeed: (feed: FeedResponse): void => {
    localStorage.setItem(`FEED_${feed.id}`, JSON.stringify(feed));
  },
  unlikeFeed: (id: string): void => {
    localStorage.removeItem(`FEED_${id}`);
  },
  isFeedLiked: (id: string): boolean => {
    return !!localStorage.getItem(`FEED_${id}`);
  }
};

export { storage };
