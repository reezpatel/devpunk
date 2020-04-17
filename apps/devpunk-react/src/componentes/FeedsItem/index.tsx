import React, { useRef, useState } from 'react';
import { FeedResponse } from '@devpunk/models';
import './FeedsItem.scss';
import { http } from '../../utils/http';
import { formatTime } from '../../utils/time';
import { HeartIcon } from '../Icons/HeartIcon';
import { ShareIcon } from '../Icons/ShareIcon';
import { storage } from '../../utils/storage';

interface FeedItemProps {
  feed: FeedResponse;
}

const FeedsItem: React.FunctionComponent<{
  feed: FeedResponse;
  key: string;
}> = ({ feed }) => {
  const [_, doRender] = useState(false);

  const liked = storage.isFeedLiked(feed.id);

  const handleHeartClicked = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (liked) {
      storage.unlikeFeed(feed.id);
    } else {
      storage.likeFeed(feed);
    }
    doRender(!_);
  };

  const handleShareButtonClick = (e: MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (navigator['share']) {
      navigator['share']({
        title: feed.title,
        url: http.getFeedUrl(feed.id)
      });
    }
  };

  return (
    <a href={http.getFeedUrl(feed.id)} target="_blank">
      <div className="feed-item">
        <div className="feed-image">
          <span>{feed.source}</span>
          <img src={http.getFeedBanner(feed.id)} alt={feed.title}></img>
        </div>
        <div className="feed-content">{feed.title}</div>
        <div className="feed-footer">
          <span>{formatTime(feed.time)}</span>
          <div className="feed-actions">
            <HeartIcon onClick={handleHeartClicked} active={liked} />
            {navigator['share'] && (
              <ShareIcon onClick={handleShareButtonClick} />
            )}
          </div>
        </div>
      </div>
    </a>
  );
};

export default FeedsItem;
